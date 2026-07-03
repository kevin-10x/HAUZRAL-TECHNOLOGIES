import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "api"))

load_dotenv()

from app.config import settings
from app.logging import logger


if __name__ == "__main__":
    logger.info("Starting Hauzral migration...")
    logger.info("Database URL: %s", settings.DATABASE_URL[:20] + "..." if settings.DATABASE_URL else "not set")
