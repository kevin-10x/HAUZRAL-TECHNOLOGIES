from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import Project, ProjectFile, Client, User, UserRole
from app.schemas import FileResponse, FileListResponse
from app.security import get_current_user
from app.services.storage import save_upload
from datetime import datetime, timezone

router = APIRouter(prefix="/files", tags=["files"])


@router.get("/", response_model=FileListResponse)
async def list_files(project_id: int = None, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = select(ProjectFile).order_by(ProjectFile.created_at.desc())

    if project_id:
        if current_user.role == UserRole.CLIENT:
            client_result = await db.execute(select(Client).where(Client.user_id == current_user.id))
            client = client_result.scalar_one_or_none()
            if not client:
                return FileListResponse(items=[], total=0)
            project_result = await db.execute(select(Project).where(Project.id == project_id, Project.client_id == client.id))
            if not project_result.scalar_one_or_none():
                raise HTTPException(status_code=404, detail="Project not found")
        query = query.where(ProjectFile.project_id == project_id)
    elif current_user.role == UserRole.CLIENT:
        client_result = await db.execute(select(Client).where(Client.user_id == current_user.id))
        client = client_result.scalar_one_or_none()
        if not client:
            return FileListResponse(items=[], total=0)
        project_ids = select(Project.id).where(Project.client_id == client.id)
        query = query.where(ProjectFile.project_id.in_(project_ids))

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()
    result = await db.execute(query.limit(100))
    files = result.scalars().all()

    return FileListResponse(
        items=[
            FileResponse(
                id=f.id,
                project_id=f.project_id,
                filename=f.filename,
                original_filename=f.original_filename,
                file_path=f.file_path,
                file_size=f.file_size,
                content_type=f.content_type,
                is_public=f.is_public,
                created_at=f.created_at,
            )
            for f in files
        ],
        total=total,
    )


@router.post("/upload", response_model=FileResponse, status_code=201)
async def upload_file(project_id: int, file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    project_result = await db.execute(select(Project).where(Project.id == project_id))
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role == UserRole.CLIENT:
        client_result = await db.execute(select(Client).where(Client.user_id == current_user.id))
        client = client_result.scalar_one_or_none()
        if not client or project.client_id != client.id:
            raise HTTPException(status_code=403, detail="Access denied")

    file_path, file_size, content_type = await save_upload(file, project_id)

    project_file = ProjectFile(
        project_id=project_id,
        filename=file_path.split("/")[-1],
        original_filename=file.filename,
        file_path=file_path,
        file_size=file_size,
        content_type=content_type or file.content_type,
        uploaded_by=current_user.id,
    )
    db.add(project_file)
    await db.commit()
    await db.refresh(project_file)

    return FileResponse(
        id=project_file.id,
        project_id=project_file.project_id,
        filename=project_file.filename,
        original_filename=project_file.original_filename,
        file_path=project_file.file_path,
        file_size=project_file.file_size,
        content_type=project_file.content_type,
        is_public=project_file.is_public,
        created_at=project_file.created_at,
    )


@router.delete("/{file_id}", status_code=204)
async def delete_file(file_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPERADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")

    result = await db.execute(select(ProjectFile).where(ProjectFile.id == file_id))
    project_file = result.scalar_one_or_none()
    if not project_file:
        raise HTTPException(status_code=404, detail="File not found")

    from sqlalchemy import delete as sqla_delete
    await db.execute(sqla_delete(ProjectFile).where(ProjectFile.id == file_id))
    await db.commit()
    return None
