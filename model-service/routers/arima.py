from fastapi import APIRouter
from controllers import arima
from models.arima import ARIMAParams, SARIMAParams, SARIMAXParams


router = APIRouter()


@router.post("/arima")
async def create_arima_model(params: ARIMAParams):
    return await arima.create_arima_model(params)


@router.post("/sarima")
async def create_sarima_model(params: SARIMAParams):
    return await arima.create_sarima_model(params)


@router.post("/sarimax/")
async def create_sarimax_model(params: SARIMAXParams):
    return await arima.create_sarimax_model(params)
