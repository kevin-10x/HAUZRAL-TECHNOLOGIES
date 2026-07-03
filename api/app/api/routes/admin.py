from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import User, UserRole
from app.schemas import AdminDashboardResponse, ClientSummary, ProjectSummary, DashboardStats
from app.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/dashboard", response_model=AdminDashboardResponse)
async def admin_dashboard(current_user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    total_projects = (await db.execute(func.count(select(Project.id).subquery()))).scalar_one()
    total_clients = (await db.execute(func.count(select(Client.id).subquery()))).scalar_one()
    total_contacts = (await db.execute(func.count(select(ContactSubmission.id).subquery()))).scalar_one()
    total_revenue = (await db.execute(select(func.coalesce(func.sum(Invoice.amount), 0)).where(Invoice.status == "paid"))).scalar_one()

    monthly_revenue = (await db.execute(
        select(
            func.date_trunc("month", Invoice.paid_at).label("month"),
            func.sum(Invoice.amount).label("revenue"),
        )
        .where(Invoice.status == "paid")
        .group_by("month")
        .order_by("month")
        .limit(12)
    )).mappings().all()

    active_projects = (await db.execute(
        select(Project.id, Project.title, Project.progress, Client.name.label("client_name"))
        .join(Client, Project.client_id == Client.id)
        .where(Project.stage_status != "Completed")
        .limit(10)
    )).mappings().all()

    recent_contacts = (await db.execute(
        select(ContactSubmission.id, ContactSubmission.name, ContactSubmission.email, ContactSubmission.created_at, ContactSubmission.service_interest)
        .order_by(ContactSubmission.created_at.desc())
        .limit(10)
    )).mappings().all()

    return AdminDashboardResponse(
        stats=DashboardStats(
            total_projects=total_projects,
            total_clients=total_clients,
            total_contacts=total_contacts,
            total_revenue=float(total_revenue),
            monthly_revenue=[
                {
                    "month": str(row["month"]) if row["month"] else None,
                    "revenue": float(row["revenue"] or 0),
                }
                for row in monthly_revenue
            ],
        ),
        active_projects=[
            ProjectSummary(id=p["id"], title=p["title"], progress=p["progress"], client_name=p["client_name"])
            for p in active_projects
        ],
        recent_contacts=list(recent_contacts),
    )


@router.get("/analytics/clients", tags=["admin"])
async def client_analytics(current_user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    total = (await db.execute(func.count(select(Client.id).subquery()))).scalar_one()
    by_type = (await db.execute(select(Client.project_type, func.count()).group_by(Client.project_type))).mappings().all()
    recent = (await db.execute(
        select(Client.id, Client.name, Client.email, Client.project_type, Client.created_at)
        .order_by(Client.created_at.desc())
        .limit(20)
    )).mappings().all()
    return {"total": total, "by_type": [dict(r) for r in by_type], "recent": [dict(r) for r in recent]}


@router.get("/analytics/projects", tags=["admin"])
async def project_analytics(current_user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    by_status = (await db.execute(
        select(Project.stage_status, func.count()).group_by(Project.stage_status)
    )).mappings().all()
    avg_progress = (await db.execute(func.avg(Project.progress))).scalar_one()
    return {"by_status": [dict(r) for r in by_status], "average_progress": float(avg_progress or 0)}


@router.get("/clients", tags=["admin"])
async def admin_list_clients(page: int = 1, size: int = 20, q: str = None, current_user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    from app.api.routes.clients import list_clients
    return await list_clients(q=q, page=page, size=size, current_user=current_user, db=db)
