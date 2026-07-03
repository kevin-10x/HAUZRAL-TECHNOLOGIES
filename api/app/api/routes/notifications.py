from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.database import get_db
from app.models import Notification, User, UserRole, NotificationChannel
from app.schemas import NotificationResponse, NotificationCreate
from app.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=list[NotificationResponse])
async def list_notifications(
    channel: str = None,
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Notification).where(Notification.user_id == current_user.id).order_by(desc(Notification.created_at))

    if channel:
        try:
            query = query.where(Notification.channel == NotificationChannel(channel))
        except ValueError:
            pass

    if unread_only:
        query = query.where(Notification.read_at == None)

    result = await db.execute(query)
    notifications = result.scalars().all()
    return [
        NotificationResponse(
            id=n.id,
            channel=n.channel.value,
            subject=n.subject,
            message=n.message,
            data=n.data,
            read_at=n.read_at,
            failed_at=n.failed_at,
            error=n.error,
            created_at=n.created_at,
        )
        for n in notifications
    ]


@router.post("/", response_model=NotificationResponse, status_code=201)
async def create_notification(payload: NotificationCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    notification = Notification(
        user_id=current_user.id,
        subject=payload.subject,
        message=payload.message,
        channel=getattr(NotificationChannel, payload.channel.upper(), NotificationChannel.IN_APP),
        data=payload.data,
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)

    from app.services.tasks import send_notification
    send_notification.delay(notification.id)

    return NotificationResponse(
        id=notification.id,
        channel=notification.channel.value,
        subject=notification.subject,
        message=notification.message,
        data=notification.data,
        read_at=notification.read_at,
        failed_at=notification.failed_at,
        error=notification.error,
        created_at=notification.created_at,
    )


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_read(notification_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.read_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(notification)

    return NotificationResponse(
        id=notification.id,
        channel=notification.channel.value,
        subject=notification.subject,
        message=notification.message,
        data=notification.data,
        read_at=notification.read_at,
        failed_at=notification.failed_at,
        error=notification.error,
        created_at=notification.created_at,
    )
