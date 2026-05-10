from pydantic import BaseModel, field_validator
from typing import Optional, List

class TaskParams(BaseModel):
  items: dict[str, float]

  @field_validator("items", mode="before")
  @classmethod
  def build_dict(cls, v):
      result = {}
      for item in v:
          result[item.param] = item.value
      return result