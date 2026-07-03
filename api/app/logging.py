import logging
import sys
from loguru import logger
from app.config import settings

logger.remove()
logger.add(
    sys.stdout,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    ),
    level=settings.LOG_LEVEL,
    colorize=True,
)


class InterceptHandler(logging.Handler):
    def emit(self, record):
        logger_opt = logger.opt(depth=6, exception=record.exc_info)
        logger_opt.log(record.levelname, record.getMessage())


for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "sqlalchemy", "alembic"):
    log = logging.getLogger(name)
    log.handlers = [InterceptHandler()]
    log.setLevel(settings.LOG_LEVEL)
