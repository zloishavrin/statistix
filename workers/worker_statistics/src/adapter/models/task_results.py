from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Literal
import pandas as pd

class TaskResults(BaseModel):
  model_config = ConfigDict(arbitrary_types_allowed=True)
  params: Optional[dict[str, float]] = None
  table: Optional[dict[str, pd.Series]] = None
  tables: Optional[dict[str, pd.DataFrame]] = None