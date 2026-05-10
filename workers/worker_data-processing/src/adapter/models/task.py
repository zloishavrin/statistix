from typing import Optional, List, Callable
from .task_params import TaskParams
from .task_columns import TaskColumns, TaskMultipleColumns
from .task_results import TaskResults

class Task:
  id: str
  language: str
  params: Optional[TaskParams] = None
  columns: Optional[TaskColumns] = None
  tables: Optional[TaskMultipleColumns] = None

  _handle_results: Callable[[str, str, TaskResults], None]
  _handle_error: Callable[[str, str, Optional[str]], None]

  def __init__(
    self,
    id: str,
    language: str,
    handle_results: Callable[[str, TaskResults], None],
    handle_error: Callable[[str, Optional[str]], None],
  ):
    self.id = id
    self.language = language
    self._handle_results = handle_results
    self._handle_error = handle_error

  async def complete(
    self,
    results: TaskResults
  ):
    await self._handle_results(
      self.id,
      self.language,
      results,
    )

  async def failed(
    self,
    error_message: Optional[str]
  ):
    await self._handle_error(
      self.id,
      self.language,
      error_message,
    )
