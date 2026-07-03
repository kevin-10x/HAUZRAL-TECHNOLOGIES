import time
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from app.models import ContactSubmission, UserRole
from app.schemas import ContactCreate, ContactResponse
from app.services.cache import cache_response
from app.config import settings

router = APIRouter(prefix="/contact", tags=["contact"])


@router.get("/", response_model=dict)
async def list_contacts(request: Request, db: AsyncSession = Depends(get_db)):
    x_admin_api_key = request.headers.get("x-admin-api-key")
    if x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(
        text("SELECT id, name, email, message, service_interest, budget_range, status, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 100")
    )
    rows = result.mappings().all()
    return {"contacts": [dict(r) for r in rows]}


@router.post("/", response_model=ContactResponse, status_code=202)
@cache_response(ttl=300, key_prefix="contact_submit")
async def submit_contact(payload: ContactCreate, db: AsyncSession = Depends(get_db)):
    from app.services.tasks import send_contact_notification

    contact = ContactSubmission(
        name=payload.name,
        email=payload.email,
        message=payload.message,
        service_interest=payload.service_interest,
        budget_range=payload.budget_range,
    )
    db.add(contact)
    await db.commit()
    await db.refresh(contact)

    from app.config import settings
    if settings.ENVIRONMENT != "test":
        from app.services.tasks import send_contact_notification
        send_contact_notification.delay(
            contact_id=contact.id,
            name=payload.name,
            email=payload.email,
            message=payload.message,
            service=payload.service_interest or "General Inquiry",
        )

    return ContactResponse(
        message="Contact request received",
        id=contact.id,
        name=contact.name,
        email=contact.email,
        service_interest=contact.service_interest,
        created_at=contact.created_at,
    )
