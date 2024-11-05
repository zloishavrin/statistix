from fastapi import APIRouter
from controllers import TimeSeriesModels
from models.TimeSeriesModels import ARParams, MAParams, ARMAParams, ARIMAParams, SARIMAParams, SARIMAXParams


router = APIRouter()


@router.post("/tsm/ar")
async def create_ar_model(params: ARParams):
    return await TimeSeriesModels.create_ar_model(params)


@router.post("/tsm/ma")
async def create_ma_model(params: MAParams):
    return await TimeSeriesModels.create_ma_model(params)


@router.post("/tsm/arma")
async def create_arma_model(params: ARMAParams):
    return await TimeSeriesModels.create_arma_model(params)


@router.post("/tsm/arima")
async def create_arima_model(params: ARIMAParams):
    return await TimeSeriesModels.create_arima_model(params)


@router.post("/tsm/sarima")
async def create_sarima_model(params: SARIMAParams):
    return await TimeSeriesModels.create_sarima_model(params)


@router.post("/tsm/sarimax")
async def create_sarimax_model(params: SARIMAXParams):
    return await TimeSeriesModels.create_sarimax_model(params)
