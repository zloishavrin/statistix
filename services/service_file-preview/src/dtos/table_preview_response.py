from pydantic import BaseModel, Field
from typing import Optional, List, Union

TableValue = Union[str, int, float, bool, None]

class TableColumnPreviewResponse(BaseModel):
    name: Optional[str] = None
    values: List[TableValue]

class TablePreviewResponse(BaseModel):
    id: str = Field(..., alias="_id")
    filename: str
    columns: List[TableColumnPreviewResponse]