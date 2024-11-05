from fastapi import HTTPException
from services import TimeSeriesModels
from models.TimeSeriesModels import ARParams, MAParams, ARMAParams, ARIMAParams, SARIMAParams, SARIMAXParams

async def create_ar_model(params: ARParams):
    data = params.data
    steps = params.steps

    try:
        response = TimeSeriesModels.fit_ar_model(params.p, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response


async def create_ma_model(params: MAParams):
    data = params.data
    steps = params.steps

    try:
        response = TimeSeriesModels.fit_ma_model(params.q, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response


async def create_arma_model(params: ARMAParams):
    data = params.data
    steps = params.steps

    try:
        response = TimeSeriesModels.fit_arma_model(params.p, params.q, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response


async def create_arima_model(params: ARIMAParams):
    data = params.data
    steps = params.steps

    try:
        response = TimeSeriesModels.fit_arima_model(params.p, params.d, params.q, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response


async def create_sarima_model(params: SARIMAParams):
    data  = params.data
    steps  = params.steps

    try:
        response = TimeSeriesModels.fit_sarima_model(params.p, params.d, params.q, params.P, params.D, params.Q, params.s, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response


async def create_sarimax_model(params: SARIMAXParams):
    data  = params.data
    steps  = params.steps
    
    try:
        response = TimeSeriesModels.fit_sarimax_model(params.p, params.d, params.q, params.P, params.D, params.Q, params.s, params.I, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response
