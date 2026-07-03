from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import Client, Project, User, UserRole
from app.schemas import ClientCreate, ClientResponse, ClientUpdate, ClientListResponse, ProjectSummary
from app.security import get_current_user

router = APIRouter(prefix="/clients", tags=["clients"])


async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/", response_model=ClientListResponse)
async def list_clients(
    q: str = Query(None, description="Search by name, email, or company"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * size
    query = select(Client).order_by(Client.created_at.desc())

    if q:
        query = query.where(
            or_(
                Client.name.ilike(f"%{q}%"),
                Client.email.ilike(f"%{q}%"),
                Client.company.ilike(f"%{q}%"),
            )
        )

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    query = query.offset(offset).limit(size).options(selectinload(Client.projects))
    result = await db.execute(query)
    clients = result.scalars().unique().all()

    items = []
    for client in clients:
        items.append(ClientResponse(
            id=client.id,
            name=client.name,
            email=client.email,
            company=client.company,
            phone=client.phone,
            project_type=client.project_type,
            notes=client.notes,
            tags=client.tags,
            created_at=client.created_at,
            project_count=len(client.projects),
        ))

    return ClientListResponse(items=items, total=total, page=page, size=size)


@router.post("/", response_model=ClientResponse, status_code=201)
async def create_client(payload: ClientCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Client).where(Client.email == payload.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Client with this email already exists")

    client = Client(**payload.model_dump(exclude={"password"}))
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return ClientResponse.model_validate(client)


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    result = await db.execute(
        select(Client).where(Client.id == client_id).options(selectinload(Client.projects))
    )
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return ClientResponse(
        id=client.id,
        name=client.name,
        email=client.email,
        company=client.company,
        phone=client.phone,
        project_type=client.project_type,
        notes=client.notes,
        tags=client.tags,
        created_at=client.created_at,
        project_count=len(client.projects),
    )


@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(client_id: int, payload: ClientUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)

    await db.commit()
    await db.refresh(client)
    return ClientResponse.model_validate(client)
