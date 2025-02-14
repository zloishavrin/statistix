from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller


def fit_ar_model(p: int, data, steps: int):
    model = ARIMA(data, order=(p, 0, 0), trend="t")
    model_fit = model.fit()
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    equation = arima_equation(p, 0, 0, params)
    predictions = model_fit.get_prediction().predicted_mean.tolist()
    forecast_data = predictions.copy()
    if steps > 0:
        forecast = model_fit.forecast(steps=steps).tolist()
        forecast_data.extend(forecast)

    response = {
        "params": {
            "p": p,
        },
        "equation": equation,
        "aic": model_fit.aic,
        "aicc": model_fit.aicc,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "llf": model_fit.llf,
        "mse": model_fit.mse,
        "mae": model_fit.mae,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": data,
        "forecast_data": forecast_data,
    }

    return response


def fit_ma_model(q: int, data, steps: int):
    model = ARIMA(data, order=(0, 0, q), trend="t")
    model_fit = model.fit()
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    equation = arima_equation(0, 0, q, params)
    predictions = model_fit.get_prediction().predicted_mean.tolist()
    forecast_data = predictions.copy()
    if steps > 0:
        forecast = model_fit.forecast(steps=steps).tolist()
        forecast_data.extend(forecast)

    response = {
        "params": {
            "q": q,
        },
        "equation": equation,
        "aic": model_fit.aic,
        "aicc": model_fit.aicc,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "llf": model_fit.llf,
        "mse": model_fit.mse,
        "mae": model_fit.mae,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": data,
        "forecast_data": forecast_data,
    }

    return response


def fit_arma_model(p: int, q: int, data, steps: int):
    model = ARIMA(data, order=(p, 0, q), trend="t")
    model_fit = model.fit()
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    equation = arima_equation(p, 0, q, params)
    predictions = model_fit.get_prediction().predicted_mean.tolist()
    forecast_data = predictions.copy()
    if steps > 0:
        forecast = model_fit.forecast(steps=steps).tolist()
        forecast_data.extend(forecast)

    response = {
        "params": {
            "p": p,
            "q": q,
        },
        "equation": equation,
        "aic": model_fit.aic,
        "aicc": model_fit.aicc,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "llf": model_fit.llf,
        "mse": model_fit.mse,
        "mae": model_fit.mae,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": data,
        "forecast_data": forecast_data,
    }

    return response


def fit_arima_model(p: int, d: int, q: int, data, steps: int):
    model = ARIMA(data, order=(p, d, q), trend="t")
    model_fit = model.fit()
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    equation = arima_equation(p, d, q, params)
    predictions = model_fit.get_prediction().predicted_mean.tolist()
    forecast_data = predictions.copy()
    if steps > 0:
        forecast = model_fit.forecast(steps=steps).tolist()
        forecast_data.extend(forecast)

    response = {
        "params": {
            "p": p,
            "d": d,
            "q": q
        },
        "equation": equation,
        "aic": model_fit.aic,
        "aicc": model_fit.aicc,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "llf": model_fit.llf,
        "mse": model_fit.mse,
        "mae": model_fit.mae,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": data,
        "forecast_data": forecast_data,
    }

    return response


def fit_sarima_model(p: int, d: int, q: int, P: int, D: int, Q: int, s: int, data, steps: int):
    model = SARIMAX(data, order=(p, d, q), seasonal_order=(P, D, Q, s), trend="t", exog=None)
    model_fit = model.fit(disp=False)
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    equation = sarima_equation(p, d, q, P, D, Q, s, params)

    forecast_data = data.copy()
    if steps > 0:
        forecast = model_fit.forecast(steps=steps).tolist()
        forecast_data.extend(forecast)

    response = {
        "params": {
            "p": p,
            "d": d,
            "q": q,
            "P": P,
            "D": D,
            "Q": Q,
            "s": s
        },
        "equation": equation,
        "aic": model_fit.aic,
        "aicc": model_fit.aicc,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "llf": model_fit.llf,
        "mse": model_fit.mse,
        "mae": model_fit.mae,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": data,
        "forecast_data": forecast_data,
    }

    return response


def fit_sarimax_model(p: int, d: int, q: int, P: int, D: int, Q: int, s: int, I: int, data, steps: int):
    model = SARIMAX(data, order=(p, d, q), seasonal_order=(P, D, Q, s), trend="t")
    model_fit = model.fit(disp=False)
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    equation = sarimax_equation(p, d, q, P, D, Q, s, I, params)

    forecast_data = data.copy()
    if steps > 0:
        forecast = model_fit.forecast(steps=steps).tolist()
        forecast_data.extend(forecast)

    response = {
        "params": {
            "p": p,
            "d": d,
            "q": q,
            "P": P,
            "D": D,
            "Q": Q,
            "s": s,
            "I": I
        },
        "equation": equation,
        "aic": model_fit.aic,
        "aicc": model_fit.aicc,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "llf": model_fit.llf,
        "mse": model_fit.mse,
        "mae": model_fit.mae,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": forecast_data,
    }

    return response


def arima_equation(p, d, q, params):
    ar_params = params[:p]
    ma_params = params[p:p+q]
    intercept = params[-1] if len(params) == p + q + 1 else 0

    equation = "y(t) = "

    if intercept != 0:
        equation += f"{intercept} + "

    for i, param in enumerate(ar_params):
        equation += f"{param}∙y(t-{i+1}) + "

    for i, param in enumerate(ma_params):
        equation += f"{param}∙e(t-{i+1}) + "

    equation += "e(t)"

    return equation


def sarima_equation(p, d, q, P, D, Q, s, params):
    ar_params = params[:p]
    ma_params = params[p:p+q]
    seasonal_ar_params = params[p+q:p+q+P]
    seasonal_ma_params = params[p+q+P:p+q+P+Q]
    intercept = params[-1] if len(params) == p + q + P + Q + 1 else 0

    equation = "y(t) = "

    if intercept != 0:
        equation += f"{intercept} + "

    for i, param in enumerate(ar_params):
        equation += f"{param}∙y(t-{i+1}) + "

    for i, param in enumerate(ma_params):
        equation += f"{param}∙e(t-{i+1}) + "

    for i, param in enumerate(seasonal_ar_params):
        equation += f"{param}∙y(t-{s*(i+1)}) + "

    for i, param in enumerate(seasonal_ma_params):
        equation += f"{param}∙e(t-{s*(i+1)}) + "

    equation += "e(t)"

    return equation


def sarimax_equation(p, d, q, P, D, Q, s, I, params):
    ar_params = params[:p]
    ma_params = params[p:p+q]
    seasonal_ar_params = params[p+q:p+q+P]
    seasonal_ma_params = params[p+q+P:p+q+P+Q]
    intercept = params[-1] if len(params) == p + q + P + Q + 1 else 0

    equation = "y(t) = "

    if intercept != 0:
        equation += f"{intercept} + "

    for i, param in enumerate(ar_params):
        equation += f"{param}∙y(t-{i+1}) + "

    for i, param in enumerate(ma_params):
        equation += f"{param}∙e(t-{i+1}) + "

    for i, param in enumerate(seasonal_ar_params):
        equation += f"{param}∙y(t-{s*(i+1)}) + "

    for i, param in enumerate(seasonal_ma_params):
        equation += f"{param}∙e(t-{s*(i+1)}) + "

    equation += "e(t)"

    return equation
