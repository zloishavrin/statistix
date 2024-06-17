from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

def fit_arima_model(p: int, d: int, q: int, data: list, steps: int):
    model = ARIMA(data, order=(p, d, q))
    model_fit = model.fit()
    params = model_fit.params.tolist()
    adf_result = adfuller(data)

    data = data
    equation = arima_equation(p, d, q, params)

    if(steps):
        forecast = model_fit.forecast(steps=steps).tolist()
        data.extend(forecast)

    response = {
        "params": {
            "p": p,
            "d": d,
            "q": q
        },
        "equation": equation,
        "aic": model_fit.aic,
        "bic": model_fit.bic,
        "hqic": model_fit.hqic,
        "adf_statistic": adf_result[0],
        "p_value": adf_result[1],
        "used_lag": adf_result[2],
        "n_obs": adf_result[3],
        "critical_values": adf_result[4],
        "icbest": adf_result[5],
        "data": data,
    }

    return response

def arima_equation(p: int, d: int, q: int, params: list) -> str:
    index = 0
    
    if len(params) == p + q + 2:
        const = params[0]
        index += 1
    else:
        const = 0

    ar_params = params[index:index + p]
    index += p
    ma_params = params[index:index + q]
    sigma2 = params[-1]

    const_term = f"{const}" if const else ""
    ar_terms = " ".join([f"{'+' if coef > 0 else ''}{coef}∙AR(t-{i+1})" for i, coef in enumerate(ar_params)])
    ma_terms = " ".join([f"{'+' if coef > 0 else ''}{coef}∙MA(t-{i+1})" for i, coef in enumerate(ma_params)])
    
    equation = f"y(t) = {sigma2}"
    if const_term:
        equation += f"+{const_term}" if float(const_term) > 0 else f" {const_term}"
    if ar_terms:
        equation += f"{ar_terms}"
    if ma_terms:
        equation += f"{ma_terms}"
    
    return equation