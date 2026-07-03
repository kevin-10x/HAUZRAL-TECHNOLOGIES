"""Background task definitions for Celery workers."""

import httpx
import logging
from datetime import datetime, timezone
from celery import Celery
from app.config import settings
from app.logging import logger

celery_app = Celery(
    "hauzral-tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.services.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    task_track_started=True,
    task_time_limit=60,
    broker_connection_retry_on_startup=True,
)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_task(self, recipient: str, subject: str, body: str) -> dict:
    logger.info("Sending email to %s: %s", recipient, subject)
    return {"status": "sent", "recipient": recipient, "subject": subject}


@celery_app.task(bind=True, max_retries=2, default_retry_delay=30)
def send_contact_notification(self, contact_id: int, name: str, email: str, message: str, service: str):
    logger.info("[%s] New contact from %s <%s> | Service: %s | Msg: %s", contact_id, name, email, service, message[:100])
    try:
        send_email_task.delay(
            recipient=settings.SMTP_USER or "admin@hauzral.com",
            subject=f"[Hauzral Contact] New inquiry: {service}",
            body=f"Name: {name}\\nEmail: {email}\\nService: {service}\\nMessage: \\n{message}",
        )
    except Exception:
        logger.warning("Could not enqueue contact notification")


@celery_app.task(bind=True, max_retries=3, default_retry_delay=90)
def send_welcome_email(self, email: str, name: str):
    logger.info("Sending welcome email to %s", email)
    send_email_task.delay(
        recipient=email,
        subject="Welcome to Hauzral Technologies",
        body=f"Hi {name}, welcome to Hauzral Technologies. We're excited to have you!",
    )


@celery_app.task(bind=True, max_retries=2)
def send_notification(self, notification_id: int):
    logger.info("Processing notification %s via Celery", notification_id)
    return {"status": "processed", "notification_id": notification_id}


@celery_app.task(bind=True, max_retries=2)
def process_file_upload(self, file_path: str):
    logger.info("Processing file: %s", file_path)
    return {"status": "processed", "file": file_path}


@celery_app.task(bind=True)
def generate_report(self, report_type: str, params: dict):
    logger.info("Generating %s report with params: %s", report_type, params)
    return {"status": "generated", "report_type": report_type}


@celery_app.task(bind=True)
def notify_client_project_update(self, client_email: str, project_title: str, new_stage: str):
    logger.info("Notifying %s about project '%s' stage: %s", client_email, project_title, new_stage)
    try:
        send_email_task.delay(
            recipient=client_email,
            subject=f"Project Update: {project_title} — {new_stage}",
            body=f"Your project '{project_title}' has been updated to stage: {new_stage}.",
        )
    except Exception:
        logger.warning("Could not enqueue project update notification")


@celery_app.task(bind=True)
def daily_health_check(self):
    from app.services.cache import cache
    import asyncio
    redis_status = asyncio.get_event_loop().run_until_complete(cache.health())
    logger.info("Daily health check: Redis=%s", redis_status)
    return {"status": "healthy", "redis": redis_status, "checked_at": datetime.now(timezone.utc).isoformat()}


@celery_app.task(bind=True)
def analyze_metrics(self):
    logger.info("Analyzing metrics...")
    return {"status": "completed", "timestamp": datetime.now(timezone.utc).isoformat()}


celery_app.conf.beat_schedule = {
    "daily-health-check": {
        "task": "app.services.tasks.daily_health_check",
        "schedule": 3600,
    },
}
