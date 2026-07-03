from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.models import SubscriptionTier, NotificationChannel, TaskStatus


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    message: str = Field(..., min_length=20, max_length=2000)
    service_interest: Optional[str] = Field(None, max_length=100)
    budget_range: Optional[str] = Field(None, max_length=100)


class ContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    message: str
    id: int
    name: str
    email: str
    service_interest: Optional[str]
    created_at: Optional[datetime]


class ClientRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8)
    company: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    project_type: Optional[str] = Field(None, max_length=100)


class ClientLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    id_token: str = Field(..., description="Google ID token from frontend")


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800
    user: "ClientResponse"


class TokenRefresh(BaseModel):
    refresh_token: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class ClientUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    project_type: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    tags: Optional[List[str]] = None


class ClientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    project_type: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    project_count: Optional[int] = 0


class ClientListResponse(BaseModel):
    items: List[ClientResponse]
    total: int
    page: int
    size: int


class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    summary: str = Field(..., min_length=10, max_length=1000)
    description: Optional[str] = Field(None, max_length=5000)
    budget: Optional[str] = Field(None, max_length=100)
    timeline: Optional[str] = Field(None, max_length=100)
    requirements: Optional[str] = Field(None, max_length=5000)
    priority: Optional[str] = Field("medium", pattern="^(low|medium|high|critical)$")


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    summary: Optional[str] = Field(None, max_length=1000)
    description: Optional[str] = Field(None, max_length=5000)
    budget: Optional[str] = Field(None, max_length=100)
    timeline: Optional[str] = Field(None, max_length=100)
    requirements: Optional[str] = Field(None, max_length=5000)
    stage_status: Optional[str] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    priority: Optional[str] = Field(None, pattern="^(low|medium|high|critical)$")
    stages: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[str]] = None
    meta_data: Optional[Dict[str, Any]] = None


class StageUpdate(BaseModel):
    stage_name: str
    status: Optional[str] = "In progress"
    note: Optional[str] = ""


class TaskCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: str = Field("medium", pattern="^(low|medium|high|critical)$")
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    assignee_id: Optional[int]
    tags: Optional[List[str]]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class ProjectSummary(BaseModel):
    id: int
    title: str
    progress: int
    client_name: Optional[str] = None


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    title: str
    summary: str
    description: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    requirements: Optional[str] = None
    stage_status: str
    stages: List[Dict[str, Any]]
    progress: int
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    meta_data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    size: int


class FileResponse(BaseModel):
    id: int
    project_id: int
    filename: str
    original_filename: str
    file_path: str
    file_size: Optional[int] = None
    content_type: Optional[str] = None
    is_public: bool = False
    created_at: Optional[datetime] = None


class FileListResponse(BaseModel):
    items: List[FileResponse]
    total: int


class NotificationCreate(BaseModel):
    subject: str = Field(..., max_length=255)
    message: str = Field(..., max_length=2000)
    channel: str = Field("in_app", pattern="^(email|sms|push|in_app)$")
    data: Optional[Dict[str, Any]] = None


class NotificationResponse(BaseModel):
    id: int
    channel: str
    subject: str
    message: str
    data: Optional[Dict[str, Any]] = None
    read_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    error: Optional[str] = None
    created_at: Optional[datetime] = None


class DashboardStats(BaseModel):
    total_projects: int
    total_clients: int
    total_contacts: int
    total_revenue: float
    monthly_revenue: List[Dict[str, Any]]


class AdminDashboardResponse(BaseModel):
    stats: DashboardStats
    active_projects: List[ProjectSummary]
    recent_contacts: List[Dict[str, Any]]


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    database: str
    redis: Optional[str] = None
    celery: Optional[str] = None


TokenPair.model_rebuild()
