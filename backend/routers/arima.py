from fastapi import APIRouter
from controllers import arima
from models.arima import ARIMAParams, SARIMAParams

router = APIRouter()

@router.post("/arima/")
async def create_arima_model(params: ARIMAParams):
    return await arima.create_arima_model(params)

@router.post("/sarima/")
async def create_sarima_model(params: SARIMAParams):
    return await arima.create_sarima_model(params)
