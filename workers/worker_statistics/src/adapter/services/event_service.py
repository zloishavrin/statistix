from aio_pika.abc import AbstractIncomingMessage
from .storage_service import StorageService
from collections import defaultdict
from typing import Optional, List, Callable
import json
from adapter.models import TaskQueueRequest, TaskQueueResponse, TaskQueueFailedResponse, Task, TaskParams, TaskColumns, TaskContractTable, TaskResults, TaskContractParam, TaskContractColumn, TaskTableFile, TaskMultipleColumns, TaskContractMultipleColumn
from io import BytesIO, StringIO
import pandas as pd

class EventService:
  _tableTypes = ["xlsx", "csv", "xls"]
  _on_result: Callable[[dict], None]
  _on_failed: Callable[[dict], None]

  def __init__(
    self,
    storage: StorageService,
    handle_results: Callable[[dict], None],
    handle_error: Callable[[dict], None],
  ):
    self._storage = storage
    self._on_result = handle_results
    self._on_failed = handle_error
    self._handlers = defaultdict(list)

  def on(self, method_name: str):
    def decorator(func):
      self._handlers[method_name] = func
      return func
    return decorator

  async def _emit(
    self,
    method_name: str,
    payload: TaskQueueRequest,
  ):
    handler = self._handlers.get(method_name, None)
    if handler:
      task = Task(
        id=payload.id,
        language=payload.language,
        handle_results=self._handle_results,
        handle_error=self._handle_error,
      )

      if payload.params:
        task.params = TaskParams(
          items=payload.params
        )
      if payload.columns:
        columns, tables = self._get_table(
          table=payload.columns
        )
        task.columns = columns
        task.tables = tables

      await handler(task)

  async def handle_queue_message(self, message: AbstractIncomingMessage):
    async with message.process(requeue=True):
      routing_key = message.routing_key

      parts = routing_key.split('.')
      if len(parts) < 3:
        return

      raw = json.loads(message.body)
      data = TaskQueueRequest.model_validate(raw)

      _, __, method_name = parts
      await self._emit(
        method_name=method_name,
        payload=data,
      )
    
  async def _handle_results(
    self,
    id: str,
    language: str,
    results: TaskResults,
  ):
    response = TaskQueueResponse(id=id, language=language)

    if results.params:
      response_params: List[TaskContractParam] = []
      for key, value in results.params.items():
        response_params.append(TaskContractParam(param=key, value=value))
      response.params = response_params

    if results.table or results.tables:
      response_columns: List[TaskContractColumn] = []
      response_multiple_columns: List[TaskContractMultipleColumn] = []

      dataframes = []

      if results.table:
        df_series = pd.DataFrame(results.table)
        dataframes.append(df_series)

      if results.tables:
        for key, df_part in results.tables.items():
          dataframes.append(df_part)

      if dataframes:
        df = pd.concat(dataframes, axis=1)

        if results.table:
          for key in results.table.keys():
            idx = df.columns.get_loc(key)
            response_columns.append(
              TaskContractColumn(column=key, index=idx)
            )

        if results.tables:
          for key, df_part in results.tables.items():
            indices = [df.columns.get_loc(col) for col in df_part.columns]

            response_multiple_columns.append(
              TaskContractMultipleColumn(
                column=key,
                index=indices
              )
            )

        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_values = csv_buffer.getvalue()
        csv_size = len(csv_values.encode("utf-8"))

        file_key = f"{id}-results.csv"

        self._storage.put_file(
          file_key=file_key,
          file_body=csv_values,
          content_type="text/csv",
        )

        response.columns = TaskContractTable(
          file=TaskTableFile(
            key=file_key,
            type="csv",
            size=csv_size
          ),
          columns=response_columns,
          multiple_columns=response_multiple_columns
        )

    await self._on_result(response.dict())

  async def _handle_error(
    self,
    id: str,
    language: str,
    error_message: Optional[str],
  ):
    response = TaskQueueFailedResponse(
      id=id,
      language=language,
      error_message=error_message,
    )

    await self._on_failed(response.dict())

  def _get_table(
    self,
    table: TaskContractTable,
  ) -> [Optional[TaskColumns], Optional[TaskMultipleColumns]]:
    try:
      if table.file.type not in self._tableTypes:
        return None

      file_object = self._storage.get_file(table.file.key)
      if not file_object:
        return None

      body = file_object["Body"]
      file_bytes = body.read()
      body.close()
      buffer = BytesIO(file_bytes)
      buffer.seek(0)

      if table.file.type == "csv":
        df = pd.read_csv(buffer)
      else:
        df = pd.read_excel(buffer)
      
      columns: dict[str, pd.Series] = {}
      if table.columns:
        for column in table.columns:
          target_column = df.iloc[:, column.index]
          if not target_column.empty:
            columns[column.column] = target_column

      multiple_columns: dict[str, pd.DataFrame] = {}
      if table.multiple_columns:
        for multiple_column in table.multiple_columns:
            target_df = df.iloc[:, multiple_column.index]
            if not target_df.empty:
                multiple_columns[multiple_column.column] = target_df
      
      return TaskColumns(items=columns), TaskMultipleColumns(items=multiple_columns)
    except Exception as error:
      return None

