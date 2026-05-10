from pydantic import BaseModel
from typing import Optional, List, Literal

class TaskContractColumn(BaseModel):
    column: str
    index: int

class TaskContractMultipleColumn(BaseModel):
    column: str
    index: List[int]

TaskTableFileType = Literal["xlsx", "csv", "xls"]

class TaskTableFile(BaseModel):
    key: str
    type: TaskTableFileType
    size: int

class TaskContractTable(BaseModel):
    file: TaskTableFile
    columns: Optional[List[TaskContractColumn]] = None
    multiple_columns: Optional[List[TaskContractMultipleColumn]] = None

class TaskContractParam(BaseModel):
    param: str
    value: float

class TaskQueueRequest(BaseModel):
    id: str
    language: str
    columns: Optional[TaskContractTable] = None
    params: Optional[List[TaskContractParam]] = None

class TaskQueueResponse(BaseModel):
    id: str
    language: str
    columns: Optional[TaskContractTable] = None
    params: Optional[List[TaskContractParam]] = None

class TaskQueueFailedResponse(BaseModel):
    id: str
    language: str
    error_message: Optional[str]