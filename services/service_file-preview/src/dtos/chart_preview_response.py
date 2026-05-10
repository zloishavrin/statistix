from pydantic import BaseModel, Field
from typing import Optional, List, Union

ChartValue = Union[int, float, None]

class ChartColumnPreviewResponse(BaseModel):
    name: Optional[str] = None
    values: List[ChartValue]

class ChartPreviewResponse(BaseModel):
    id: str = Field(..., alias="_id")
    filename: str
    columns: List[ChartColumnPreviewResponse]