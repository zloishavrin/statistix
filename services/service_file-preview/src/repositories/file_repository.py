from odmantic.bson import ObjectId
from odmantic import AIOEngine
from schemas.file_schema import FileSchema

class FileRepository:
  @staticmethod
  async def get_file(
    db: AIOEngine,
    file_id: str | ObjectId,
  ) -> FileSchema:
    if isinstance(file_id, str):
      file_id = ObjectId(file_id)

    return await db.find_one(
      FileSchema,
      FileSchema.id == file_id
    )