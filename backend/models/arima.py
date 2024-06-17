from pydantic import BaseModel, conlist

class ARIMAParams(BaseModel):
    p: int
    d: int
    q: int
    data: conlist(float, min_length=1)
    steps: int = None