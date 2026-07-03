from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.database import get_db
from app.models import Client, Project, User, UserRole, ProjectStatus as DBProjectStatus
from app.schemas import (
    ProjectCreate, ProjectResponse, ProjectListResponse,
    ProjectUpdate, StageUpdate, TaskCreate, TaskResponse
)

router = APIRouter(prefix="/projects", tags=["projects"])


async def require_admin_or_client(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.CLIENT]:
        raise HTTPException(status_code=403, detail="Access denied")
    return current_user


def _build_default_stages():
    return [
        {"name": "Discovery", "description": "Define goals and success criteria.", "status": "Queued"},
        {"name": "Planning", "description": "Blueprint and milestones.", "status": "Queued"},
        {"name": "Design", "description": "UX and UI preparation.", "status": "Queued"},
        {"name": "Development", "description": "Build and integrate.", "status": "Queued"},
        {"name": "Testing", "description": "Quality checks and bug fixes.", "status": "Queued"},
        {"name": "Deployment", "description": "Launch and handover.", "status": "Queued"},
    ]


@router.get("/", response_model=ProjectListResponse)
async def list_projects(
    status: str = Query(None),
    client_id: int = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_admin_or_client),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * size
    query = select(Project).order_by(desc(Project.created_at))

    if client_id and (current_user.role in [UserRole.ADMIN, UserRole.SUPERADMIN]):
        query = query.where(Project.client_id == client_id)
    elif current_user.role == UserRole.CLIENT:
        client_result = await db.execute(select(Client).where(Client.user_id == current_user.id))
        client = client_result.scalar_one_or_none()
        if not client:
            return ProjectListResponse(items=[], total=0, page=page, size=size)
        query = query.where(Project.client_id == client.id)

    if status:
        try:
            project_status = DBProjectStatus(status)
            query = query.where(Project.stage_status == project_status)
        except ValueError:
            pass

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    query = query.offset(offset).limit(size)
    result = await db.execute(query)
    projects = result.scalars().all()

    items = []
    for project in projects:
        items.append(ProjectResponse(
            id=project.id,
            client_id=project.client_id,
            title=project.title,
            summary=project.summary,
            description=project.description,
            budget=project.budget,
            timeline=project.timeline,
            requirements=project.requirements,
            stage_status=project.stage_status.value,
            stages=project.stages or _build_default_stages(),
            progress=project.progress,
            priority=project.priority,
            tags=project.tags,
            meta_data=project.meta_data,
            created_at=project.created_at,
            updated_at=project.updated_at,
        ))

    return ProjectListResponse(items=items, total=total, page=page, size=size)


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(payload: ProjectCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    client_result = await db.execute(select(Client).where(Client.user_id == current_user.id))
    client = client_result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client profile not found. Please complete your profile first.")

    project = Project(
        client_id=client.id,
        title=payload.title,
        summary=payload.summary,
        description=payload.description,
        budget=payload.budget,
        timeline=payload.timeline,
        requirements=payload.requirements,
        priority=payload.priority or "medium",
        stages=_build_default_stages(),
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)

    return ProjectResponse(
        id=project.id,
        client_id=project.client_id,
        title=project.title,
        summary=project.summary,
        description=project.description,
        budget=project.budget,
        timeline=project.timeline,
        requirements=project.requirements,
        stage_status=DBProjectStatus(project.stage_status).value,
        stages=project.stages,
        progress=project.progress,
        priority=project.priority,
        tags=project.tags,
        meta_data=project.meta_data,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role == UserRole.CLIENT:
        client_result = await db.execute(select(Client).where(Client.user_id == current_user.id))
        client = client_result.scalar_one_or_none()
        if not client or project.client_id != client.id:
            raise HTTPException(status_code=403, detail="Access denied")

    return ProjectResponse(
        id=project.id,
        client_id=project.client_id,
        title=project.title,
        summary=project.summary,
        description=project.description,
        budget=project.budget,
        timeline=project.timeline,
        requirements=project.requirements,
        stage_status=DBProjectStatus(project.stage_status).value,
        stages=project.stages or _build_default_stages(),
        progress=project.progress,
        priority=project.priority,
        tags=project.tags,
        meta_data=project.meta_data,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, payload: ProjectUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")

    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "stage_status" and isinstance(value, str):
            try:
                setattr(project, field, DBProjectStatus(value))
            except ValueError:
                continue
        else:
            setattr(project, field, value)

    if "stages" in update_data and isinstance(update_data["stages"], list):
        project.stages = update_data["stages"]

    await db.commit()
    await db.refresh(project)

    return ProjectResponse(
        id=project.id,
        client_id=project.client_id,
        title=project.title,
        summary=project.summary,
        description=project.description,
        budget=project.budget,
        timeline=project.timeline,
        requirements=project.requirements,
        stage_status=DBProjectStatus(project.stage_status).value,
        stages=project.stages or _build_default_stages(),
        progress=project.progress,
        priority=project.priority,
        tags=project.tags,
        meta_data=project.meta_data,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.post("/{project_id}/stages", response_model=ProjectResponse)
async def update_stage(project_id: int, payload: StageUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")

    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    stages = project.stages or _build_default_stages()
    stage_names = [s["name"] for s in stages]
    if payload.stage_name not in stage_names:
        raise HTTPException(status_code=400, detail=f"Invalid stage. Available: {', '.join(stage_names)}")

    stage_index = stage_names.index(payload.stage_name)
    for i, stage in enumerate(stages):
        if i < stage_index:
            stage["status"] = "Completed"
        elif i == stage_index:
            stage["status"] = payload.status or "In progress"
            stage["updatedAt"] = datetime.now(timezone.utc).isoformat()
        else:
            stage["status"] = "Queued"

    project.stage_status = payload.stage_name
    project.stages = stages
    await db.commit()
    await db.refresh(project)

    return ProjectResponse(
        id=project.id,
        client_id=project.client_id,
        title=project.title,
        summary=project.summary,
        description=project.description,
        budget=project.budget,
        timeline=project.timeline,
        requirements=project.requirements,
        stage_status=DBProjectStatus(project.stage_status).value,
        stages=project.stages,
        progress=project.progress,
        priority=project.priority,
        tags=project.tags,
        meta_data=project.meta_data,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")

    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    from sqlalchemy import delete as sqla_delete
    await db.execute(sqla_delete(Project).where(Project.id == project_id))
    await db.commit()
    return None
