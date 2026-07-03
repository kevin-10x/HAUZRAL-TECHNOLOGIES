import os
import sys
import asyncio
import uvicorn
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "api"))

load_dotenv()

from app.config import settings
from app.logging import logger


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        log_level=settings.LOG_LEVEL.lower(),
        reload=settings.DEBUG,
        workers=1 if settings.DEBUG else (os.cpu_count() or 2),
    )
