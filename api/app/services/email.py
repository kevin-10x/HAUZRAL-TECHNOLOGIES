"""Email service with SMTP fallback."""

import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
from app.logging import logger


async def send_email(to: str, subject: str, body: str) -> bool:
    if settings.EMAIL_PROVIDER == "console" or not settings.SMTP_USER:
        logger.info("[EMAIL] to=%s | subject=%s | body=%s", to, subject, body[:200])
        return True

    msg = MIMEMultipart()
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, to, msg.as_string())
        logger.info("[EMAIL] Sent to %s: %s", to, subject)
        return True
    except Exception as exc:
        logger.error("[EMAIL] Failed to send to %s: %s", to, exc)
        return False


async def send_contact_notification(contact_id: int, name: str, email: str, message: str, service: str) -> bool:
    subject = f"[Hauzral Contact] New inquiry: {service}"
    body = f"Name: {name}\\nEmail: {email}\\nService: {service}\\nMessage:\\n{message}"
    return await send_email(settings.SMTP_USER or "admin@hauzral.com", subject, body)


async def send_welcome_email(to: str, name: str) -> bool:
    subject = "Welcome to Hauzral Technologies"
    body = f"Hi {name}, welcome to Hauzral Technologies. We're excited to have you!"
    return await send_email(to, subject, body)
