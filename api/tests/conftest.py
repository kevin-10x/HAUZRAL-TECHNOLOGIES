"""Pytest configuration and fixtures."""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.database import Base as AppBase
from app.main import app
from app.config import Settings
import os


os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test.db"
os.environ["SECRET_KEY"] = "test-secret-key-for-ci-only-32chars!"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ["ADMIN_API_KEY"] = "test-admin-key"
os.environ["OPENAI_API_KEY"] = ""
os.environ["ENVIRONMENT"] = "test"


@pytest.fixture(scope="session")
def test_engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)

    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(AppBase.metadata.create_all)

    import asyncio
    asyncio.get_event_loop().run_until_complete(create_tables())

    yield engine

    async def drop_tables():
        async with engine.begin() as conn:
            await conn.run_sync(AppBase.metadata.drop_all)

    asyncio.get_event_loop().run_until_complete(drop_tables())
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine):
    session_factory = async_sessionmaker(test_engine, expire_on_commit=False, class_=AsyncSession)
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="session")
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
