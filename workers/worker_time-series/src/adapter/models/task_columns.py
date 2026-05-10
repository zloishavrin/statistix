from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional, List
import pandas as pd

class TaskColumns(BaseModel):
  model_config = ConfigDict(arbitrary_types_allowed=True)
  items: dict[str, pd.Series]

class TaskMultipleColumns(BaseModel):
  model_config = ConfigDict(arbitrary_types_allowed=True)
  items: dict[str, pd.DataFrame]
