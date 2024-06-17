from fastapi import APIRouter
from controllers import arima
from models.arima import ARIMAParams

router = APIRouter()

@router.post("/arima/")
async def create_arima_model(params: ARIMAParams):
    return await arima.create_arima_model(params)
