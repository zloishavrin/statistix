from fastapi import Header, HTTPException, status, Request
from bson import ObjectId
from core.translations import t

async def get_user_id(
  request: Request,
  x_user_id: str = Header(..., alias="x-user-id"),
) -> ObjectId:
  locale = request.state.locale

  if not ObjectId.is_valid(x_user_id):
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail=t(locale=locale, key="forbidden")
    )

  return ObjectId(x_user_id)