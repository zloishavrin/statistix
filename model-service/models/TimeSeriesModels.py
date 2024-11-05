from pydantic import BaseModel, conlist


class ARParams(BaseModel):
    p: int
    data: conlist(float, min_length=1)
    steps: int = None


class MAParams(BaseModel):
    q: int
    data: conlist(float, min_length=1)
    steps: int = None


class ARMAParams(BaseModel):
    p: int
    q: int
    data: conlist(float, min_length=1)
    steps: int = None


class ARIMAParams(BaseModel):
    p: int
    d: int
    q: int
    data: conlist(float, min_length=1)
    steps: int = None


class SARIMAParams(BaseModel):
    p: int
    d: int
    q: int
    P: int
    D: int
    Q: int
    s: int
    data: conlist(float, min_length=1)
    steps: int  = None


class SARIMAXParams(BaseModel):
    p: int
    d: int
    q: int
    P: int
    D: int
    Q: int
    s: int
    exogs: conlist(float, min_length=1) 
    data: conlist(float, min_length=1)
    steps: int  = None
