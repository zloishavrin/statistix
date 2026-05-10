from odmantic import Model, Field
from odmantic.bson import ObjectId
from datetime import datetime
from typing import Literal, Optional

FileType = Literal["xlsx", "csv", "xls"]

class FileSchema(Model):
  model_config = {
    "collection": "File"
  }

  user: ObjectId
  key: str
  type: FileType
  size: Optional[int] = None
  originalName: str
  createdAt: datetime = Field(default_factory=datetime.utcnow)