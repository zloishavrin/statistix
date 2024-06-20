from fastapi import HTTPException
from services import arima
from models.arima import ARIMAParams, SARIMAParams

async def create_arima_model(params: ARIMAParams):
    data = params.data
    steps = params.steps

    try:
        response = arima.fit_arima_model(params.p, params.d, params.q, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response

async def create_sarima_model(params: SARIMAParams):
    data  = params.data
    steps  = params.steps

    try:
        response = arima.fit_sarima_model(params.p, params.d, params.q, params.P, params.D, params.Q, params.s, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response

