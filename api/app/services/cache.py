"""In-memory cache wrapper backed by Redis when available."""

import json
import hashlib
from typing import Any, Callable, Optional
from functools import wraps

try:
    import redis.asyncio as aioredis
    _REDIS_AVAILABLE = True
except ImportError:
    _REDIS_AVAILABLE = False

from app.config import settings


class Cache:
    def __init__(self):
        self._client: Optional[Any] = None
        if _REDIS_AVAILABLE:
            try:
                self._client = aioredis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=3,
                    socket_timeout=3,
                )
            except Exception:
                self._client = None

        self._memory: dict[str, tuple[Any, float]] = {}

    async def get(self, key: str) -> Optional[Any]:
        if self._client:
            try:
                value = await self._client.get(key)
                return json.loads(value) if value else None
            except Exception:
                pass
        entry = self._memory.get(key)
        if entry:
            import time
            if time.time() < entry[1]:
                return entry[0]
            del self._memory[key]
        return None

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        if self._client:
            try:
                await self._client.set(key, json.dumps(value), ex=ttl)
                return
            except Exception:
                pass
        import time
        self._memory[key] = (value, time.time() + ttl)

    async def delete(self, key: str) -> None:
        if self._client:
            try:
                await self._client.delete(key)
            except Exception:
                pass
        self._memory.pop(key, None)

    async def clear(self) -> None:
        if self._client:
            try:
                await self._client.flushdb()
            except Exception:
                pass
        self._memory.clear()

    async def health(self) -> str:
        if self._client:
            try:
                await self._client.ping()
                return "connected"
            except Exception:
                return "error"
        return "in-memory"


cache = Cache()


def cache_response(ttl: int = 300, key_prefix: str = ""):
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request: Optional[Any] = kwargs.get("request")
            if request:
                raw = f"{request.method}:{request.url.path}"
                key_hash = hashlib.md5(raw.encode()).hexdigest()
                cache_key = f"{key_prefix}:cache:{key_hash}" if key_prefix else f"cache:{key_hash}"
            else:
                cache_key = f"{key_prefix}:cache:{func.__name__}" if key_prefix else f"cache:{func.__name__}"

            cached = await cache.get(cache_key)
            if cached is not None:
                return cached

            result = await func(*args, **kwargs)
            await cache.set(cache_key, result, ttl=ttl)
            return result
        return wrapper
    return decorator
