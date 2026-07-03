import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker
from app.database import get_db, Base as AppBase


pytestmark = pytest.mark.asyncio


@pytest_asyncio.fixture
async def db_session(test_engine):
    session_factory = async_sessionmaker(test_engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(client):
    return client


async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "database" in data
    assert data["service"] == "Hauzral Technologies API"


async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "Hauzral Technologies API"
    assert "/docs" in data["docs"]


async def test_create_contact(client: AsyncClient):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test contact message with enough characters.",
        "service_interest": "Web Development",
        "budget_range": "KES 50,000 - 100,000",
    }
    response = await client.post("/contact/", json=payload)
    assert response.status_code == 202
    data = response.json()
    assert data["message"] == "Contact request received"
    assert data["name"] == "Test User"
    assert data["service_interest"] == "Web Development"


async def test_contact_validation_short_message(client: AsyncClient):
    payload = {
        "name": "Test",
        "email": "test@example.com",
        "message": "Short",
    }
    response = await client.post("/contact/", json=payload)
    assert response.status_code == 422


async def test_client_signup_and_signin(client: AsyncClient):
    signup_payload = {
        "name": "Test Client",
        "email": "client@example.com",
        "password": "securepass123",
        "company": "TestCo",
        "phone": "+254712345678",
        "project_type": "Web Development",
    }
    response = await client.post("/auth/signup", json=signup_payload)
    assert response.status_code == 201, response.text
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "client@example.com"

    signin_response = await client.post("/auth/signin", json={
        "email": "client@example.com",
        "password": "securepass123",
    })
    assert signin_response.status_code == 200
    signin_data = signin_response.json()
    assert "access_token" in signin_data

    headers = {"Authorization": f"Bearer {signin_data['access_token']}"}
    me_response = await client.get("/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "client@example.com"


async def test_invalid_login(client: AsyncClient):
    response = await client.post("/auth/signin", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 401


async def test_refresh_token(client: AsyncClient):
    response = await client.post("/auth/signup", json={
        "name": "Refresh Test",
        "email": "refresh@example.com",
        "password": "validpass123",
    })
    tokens = response.json()
    refresh_response = await client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert refresh_response.status_code == 200
    new_data = refresh_response.json()
    assert "access_token" in new_data
    assert new_data["access_token"] != tokens["access_token"]


async def test_create_project_authenticated(client: AsyncClient):
    signup = await client.post("/auth/signup", json={
        "name": "Project Owner",
        "email": "pm@example.com",
        "password": "securepass123",
    })
    tokens = signup.json()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    response = await client.post("/projects/", json={
        "title": "E-Commerce Platform",
        "summary": "Full-featured online store for a retail brand.",
        "budget": "KES 500,000",
        "timeline": "3 months",
    }, headers=headers)

    assert response.status_code == 201, response.text
    data = response.json()
    assert data["title"] == "E-Commerce Platform"
    assert data["stage_status"] == "Discovery"
    assert len(data["stages"]) == 6


async def test_note_monitoring_and_caching(client: AsyncClient):
    import asyncio
    for _ in range(6):
        r = await client.get("/health")
        assert r.status_code == 200
        await asyncio.sleep(0.05)
    metrics = await client.get("/metrics")
    assert metrics.status_code == 200
    assert "http_requests_total" in metrics.text
