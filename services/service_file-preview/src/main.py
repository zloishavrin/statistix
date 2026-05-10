from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.mongodb import mongodb
from services.storage_service import storage
from core.config import config
from routers.preview_router import router as preview_router
from middlewares.language_middleware import LanguageMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongodb.connect(
        uri=config.DB_URI,
        db_name=config.DB_NAME,
        max_retries=config.DB_MAX_RETRY_ATTEMPTS,
        retry_delay=config.DB_RETRY_DELAY,
    )
    await storage.connect(
        endpoint=config.S3_URI,
        access_key=config.S3_ACCESS_KEY_ID,
        secret_key=config.S3_SECRET_ACCESS_KEY,
        region=config.S3_REGION,
        max_retries=config.S3_MAX_RETRY_ATTEMPTS,
        retry_delay=config.S3_RETRY_DELAY,
    )

    yield
    await mongodb.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(LanguageMiddleware)

app.include_router(preview_router)