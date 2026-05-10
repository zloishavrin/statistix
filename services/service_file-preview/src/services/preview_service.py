from odmantic import AIOEngine
from bson import ObjectId
from fastapi import HTTPException, status
from dtos.table_preview_response import TablePreviewResponse, TableColumnPreviewResponse
from dtos.chart_preview_response import ChartPreviewResponse, ChartColumnPreviewResponse
from repositories.file_repository import FileRepository
from services.storage_service import StorageService
import pandas as pd
from lttb import downsample
from io import BytesIO
from core.translations import t

class PreviewService:
  tableTypes = ["xlsx", "csv", "xls"]

  async def get_chart_preview(
    self,
    file_id: str,
    db: AIOEngine,
    storage: StorageService,
    user_id: ObjectId,
    locale: str,
  ) -> ChartPreviewResponse:
    try:
      df, original_name = await self._get_data_frame(
        file_id,
        db,
        storage,
        user_id,
        locale,
      )

      columns: list[ChartColumnPreviewResponse] = []
      for column in df.columns:
        series = df[column]
        values = pd.to_numeric(series, errors="coerce").tolist()

        if len(values) > 1000:
          x = list(range(len(values)))
          _, y_ds = downsample(x, values, n_out=1000)
          values = y_ds
        
        columns.append(
          ChartColumnPreviewResponse(
            name=column,
            values=values
          )
        )

      return ChartPreviewResponse(
        _id=file_id,
        filename=original_name,
        columns=columns
      )
    except Exception as e:
      print(e, flush=True)
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=t(locale, "unsupported_file_type")
      )

  async def get_table_preview(
    self,
    file_id: str,
    db: AIOEngine,
    storage: StorageService,
    user_id: ObjectId,
    locale: str,
  ) -> TablePreviewResponse:
    try:
      df, original_name = await self._get_data_frame(
        file_id,
        db,
        storage,
        user_id,
        locale,
      )

      columns: list[TableColumnPreviewResponse] = []
      for column in df.columns:
        values = df[column].tolist()

        if len(values) > 10:
          values = values[:10]
          values.append("...")
        
        columns.append(
          TableColumnPreviewResponse(
            name=column,
            values=values
          )
        )

      return TablePreviewResponse(
        _id=file_id,
        filename=original_name,
        columns=columns
      )
    except Exception as e:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=t(locale, "unsupported_file_type")
      )

  async def _get_data_frame(
    self,
    file_id: str,
    db: AIOEngine,
    storage: StorageService,
    user_id: ObjectId,
    locale: str,
  ) -> [pd.DataFrame, str]:
    file = await FileRepository.get_file(db, file_id)

    if not file:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=t(locale, "not_found")
      )

    if file.user != user_id:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=t(locale, "not_found")
      )

    if file.type not in self.tableTypes:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=t(locale, "unsupported_file_type")
      )

    file_object = storage.get_file(file_key=file.key)
    body = file_object["Body"]
    file_bytes = body.read()
    body.close()
    buffer = BytesIO(file_bytes)
    buffer.seek(0)

    if file.type == "csv":
      df = pd.read_csv(buffer)
    else:
      df = pd.read_excel(buffer)

    return df, file.originalName


previewService = PreviewService()