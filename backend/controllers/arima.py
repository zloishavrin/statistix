from fastapi import HTTPException
from services import arima
from models.arima import ARIMAParams 

async def create_arima_model(params: ARIMAParams):
    if params.p < 0 or params.d < 0 or params.q < 0:
        raise HTTPException(status_code=400, detail="Параметры p, d, q должны быть неотрицательными числами")

    data = params.data
    steps = params.steps

    if len(data) < max(params.p, params.d, params.q) + 1:
        raise HTTPException(status_code=400, detail="Длина набора данных слишком мала для данных параметров")

    try:
        response = arima.fit_arima_model(params.p, params.d, params.q, data, steps)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Ошибка при построении модели")

    return response
