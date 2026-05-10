from fastapi import APIRouter, Depends, Request
from db.mongodb import mongodb
from services.storage_service import storage, StorageService
from bson import ObjectId
from dependencies.user_id import get_user_id
from odmantic import AIOEngine
from dtos.table_preview_response import TablePreviewResponse
from dtos.chart_preview_response import ChartPreviewResponse
from services.preview_service import previewService

router = APIRouter(
  prefix="/api/file-preview",
  tags=["file-preview"]
)

@router.get("/chart/{file_id}", response_model=ChartPreviewResponse)
async def get_chart_preview(
  request: Request,
  file_id: str,
  db_engine: AIOEngine = Depends(mongodb.get_engine),
  storage: StorageService = Depends(storage.get_self),
  user_id: ObjectId  = Depends(get_user_id),
) -> ChartPreviewResponse:
  return await previewService.get_chart_preview(
    file_id=file_id,
    db=db_engine,
    storage=storage,
    user_id=user_id,
    locale=request.state.locale
  )

@router.get("/table/{file_id}", response_model=TablePreviewResponse)
async def get_table_preview(
  request: Request,
  file_id: str,
  db_engine: AIOEngine = Depends(mongodb.get_engine),
  storage: StorageService = Depends(storage.get_self),
  user_id: ObjectId  = Depends(get_user_id),
) -> TablePreviewResponse:
  return await previewService.get_table_preview(
    file_id=file_id,
    db=db_engine,
    storage=storage,
    user_id=user_id,
    locale=request.state.locale
  )
  
