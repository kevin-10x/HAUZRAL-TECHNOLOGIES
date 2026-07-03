from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.database import get_db
from app.models import User, UserRole, Client, Project, ContactSubmission, Invoice
from app.schemas import AdminDashboardResponse, ProjectSummary, DashboardStats
from app.security import get_current_user
from app.config import settings


router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/projects", response_model=dict)
async def list_admin_projects(request: Request, db: AsyncSession = Depends(get_db)):
    x_admin_api_key = request.headers.get("x-admin-api-key")
    if x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(
        select(Project, Client.name.label("client_name"), Client.email.label("client_email"), Client.company)
        .join(Client, Project.client_id == Client.id)
        .order_by(desc(Project.created_at))
    )
    rows = result.mappings().all()
    projects = [
        {
            "id": r["id"],
            "title": r["title"],
            "summary": r["summary"],
            "budget": r["budget"],
            "timeline": r["timeline"],
            "stage_status": r["stage_status"],
            "stages": r["stages"] or [],
            "progress": r["progress"],
            "client_name": r["client_name"],
            "client_email": r["client_email"],
            "company": r["company"],
        }
        for r in rows
    ]
    return {"projects": projects}


@router.patch("/projects/{project_id}", response_model=dict)
async def update_project_stage(
    project_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    x_admin_api_key = request.headers.get("x-admin-api-key")
    if x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    form = await request.json()
    stage_name = form.get("stageName")
    status = form.get("status", "In progress")
    note = form.get("note", "")

    if not stage_name:
        raise HTTPException(status_code=400, detail="Stage name is required")

    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    stages = project.stages or [
        {"name": "Discovery", "description": "Define goals and success criteria.", "status": "Queued"},
        {"name": "Planning", "description": "Blueprint and milestones.", "status": "Queued"},
        {"name": "Design", "description": "UX and UI preparation.", "status": "Queued"},
        {"name": "Development", "description": "Build and integrate.", "status": "Queued"},
        {"name": "Testing", "description": "Quality checks and bug fixes.", "status": "Queued"},
        {"name": "Deployment", "description": "Launch and handover.", "status": "Queued"},
    ]
    stage_names = [s["name"] for s in stages]
    if stage_name not in stage_names:
        raise HTTPException(status_code=400, detail=f"Invalid stage. Available: {', '.join(stage_names)}")

    stage_index = stage_names.index(stage_name)
    for i, stage in enumerate(stages):
        if i < stage_index:
            stage["status"] = "Completed"
        elif i == stage_index:
            stage["status"] = status
            stage["updatedAt"] = datetime.now(timezone.utc).isoformat()
            stage["note"] = note
        else:
            stage["status"] = "Queued"

    project.stage_status = stage_name
    project.stages = stages
    await db.commit()
    await db.refresh(project)

    return {"project": {"id": project.id, "title": project.title, "stage_status": project.stage_status, "stages": project.stages}}


@router.delete("/projects/{project_id}", response_model=dict)
async def delete_project(
    project_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    x_admin_api_key = request.headers.get("x-admin-api-key")
    if x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted successfully"}


@router.get("/dashboard", response_model=AdminDashboardResponse)
async def admin_dashboard(current_user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    total_projects = (await db.execute(select(Project.id).with_only_columns(func.count()))).scalar_one()
    total_clients = (await db.execute(select(Client.id).with_only_columns(func.count()))).scalar_one()
    total_contacts = (await db.execute(select(ContactSubmission.id).with_only_columns(func.count()))).scalar_one()
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
    total = (await db.execute(select(Client.id).with_only_columns(func.count()))).scalar_one()
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