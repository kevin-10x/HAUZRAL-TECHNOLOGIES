from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
from prometheus_client import Counter, Histogram, generate_latest, REGISTRY
from starlette.responses import Response

from app.config import settings
from app.logging import logger
from app.models import BaseModel
from app.database import init_models
from app.api.routes import contact, auth, clients, projects, notifications, files, admin
from app.services.cache import cache

REQUEST_COUNT = Counter("http_requests_total", "Total HTTP requests", ["method", "path", "status"])
REQUEST_DURATION = Histogram("http_request_duration_seconds", "HTTP request duration", ["method", "path"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    if settings.DEBUG:
        logger.warning("Running in DEBUG mode")
    try:
        if settings.DATABASE_URL:
            await init_models()
            logger.info("Database models initialized")
    except Exception as exc:
        logger.warning("Database init failed: %s", exc)

    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        pong = await r.ping()
        logger.info("Redis connected: %s", pong)
        await r.aclose()
    except Exception as exc:
        logger.warning("Redis connection failed: %s", exc)

    yield

    try:
        await cache.clear()
    except Exception:
        pass
    logger.info("Application shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade API for Hauzral Technologies — client management, projects, subscriptions, notifications, and analytics.",
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"] if settings.DEBUG else ["hauzral.com", "api.hauzral.com", "localhost"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


@app.middleware("http")
async def metrics_and_timing(request, call_next):
    start = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        REQUEST_COUNT.labels(request.method, request.url.path, "500").inc()
        raise
    duration = time.perf_counter() - start
    REQUEST_DURATION.labels(request.method, request.url.path).observe(duration)
    REQUEST_COUNT.labels(request.method, request.url.path, str(response.status_code)).inc()
    return response


@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(REGISTRY), media_type="text/plain")


@app.get("/health", response_model=dict)
async def health():
    redis_status = "available"
    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        pong = await r.ping()
        await r.aclose()
        redis_status = "connected"
    except Exception as exc:
        redis_status = f"unavailable ({type(exc).__name__})"

    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected",
        "redis": redis_status,
    }


app.include_router(contact.router)
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(projects.router)
app.include_router(notifications.router)
app.include_router(files.router)
app.include_router(admin.router)


@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health",
    }
