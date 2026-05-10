import asyncio
import signal
from adapter import Adapter, event, Task, TaskResults
from core.tranlations import t
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.stattools import adfuller
from sklearn.metrics import mean_squared_error
import pandas as pd
import numpy as np
from utils import get_auto_arima_order, get_auto_sarima_order, safe_metric

@event.on('arima')
async def handle_arima(task: Task):
  try:
    series = task.columns.items.get("time-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    series_clean = pd.to_numeric(series, errors='coerce').dropna()

    if len(series_clean) < 5:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    params = task.params.items or {}
    p = int(params.get("p", 1))
    d = int(params.get("d", 1))
    q = int(params.get("q", 1))

    if "p" not in params or "d" not in params or "q" not in params:
      p, d, q = get_auto_arima_order(series_clean, params)

    forecast_steps = int(params.get("forecast_steps", 5))

    model = ARIMA(series_clean, order=(p, d, q))
    fitted_model = model.fit()

    forecast_result = fitted_model.get_forecast(steps=forecast_steps)

    forecast = forecast_result.predicted_mean
    confidence_intervals = forecast_result.conf_int()

    lower_ci = confidence_intervals.iloc[:, 0]
    upper_ci = confidence_intervals.iloc[:, 1]

    prediction_in_sample = fitted_model.predict(
      start=0,
      end=len(series_clean) - 1
    )

    rmse_value = np.sqrt(
      mean_squared_error(
        series_clean[d:],
        prediction_in_sample[d:]
      )
    )

    params_series = fitted_model.params

    ar_coefs: [str] = []
    ma_coefs: [str] = []
    intercept = None
    sigma2 = None

    for name, value in params_series.items():
      if "ar" in name:
        ar_coefs.append(f"{name}={value}")
      elif "sigma2" in name:
        sigma2 = float(value)
      elif "ma" in name:
        ma_coefs.append(f"{name}={value}")
      elif "intercept" in name or "const" in name:
        intercept = float(value)

    if sigma2 is None and hasattr(fitted_model, "sigma2"):
      sigma2 = float(fitted_model.sigma2)

    forecast_index = list(range(len(forecast)))

    return await task.complete(
      results=TaskResults(
        params={
          "p": safe_metric(float(p)),
          "d": safe_metric(float(d)),
          "q": safe_metric(float(q)),
          "aic": safe_metric(float(fitted_model.aic)),
          "bic": safe_metric(float(fitted_model.bic)),
          "rmse": safe_metric(float(rmse_value)),
          "sigma2": safe_metric(float(sigma2)) if sigma2 is not None else 0.0,
          "intercept": safe_metric(float(intercept)) if intercept is not None else 0.0,
        },
        table={
          "forecast": pd.Series(forecast.values, index=forecast_index),
          "lower_ci": pd.Series(lower_ci.values, index=forecast_index),
          "upper_ci": pd.Series(upper_ci.values, index=forecast_index),
          "coefficients_ar": pd.Series(ar_coefs),
          "coefficients_ma": pd.Series(ma_coefs),
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('sarima')
async def handle_sarima(task: Task):
  try:
    series = task.columns.items.get("time-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    series_clean = pd.to_numeric(series, errors='coerce').dropna()

    if series_clean is None or len(series_clean) < 10:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    params = task.params.items or {}
    p = int(params.get("p", 1))
    d = int(params.get("d", 1))
    q = int(params.get("q", 1))
    p_seasonal = int(params.get("p_seasonal", 1))
    d_seasonal = int(params.get("d_seasonal", 1))
    q_seasonal = int(params.get("q_seasonal", 1))

    forecast_steps = int(params.get("forecast_steps", 5))
    seasonal_length = int(params.get("seasonal_length", 12))

    if series_clean is None or len(series_clean) < seasonal_length*3:
      return await task.failed(error_message=t(task.language, 'not_enough_data'))

    if "p" not in params or "d" not in params or "q" not in params or "p_seasonal" not in params or "d_seasonal" not in params or "q_seasonal" not in params:
      p, d, q, p_seasonal, d_seasonal, q_seasonal = get_auto_sarima_order(
        series=series_clean,
        params=params,
        seasonal_length=seasonal_length
      )

    model = SARIMAX(
      series_clean,
      order=(p, d, q),
      seasonal_order=(p_seasonal, d_seasonal, q_seasonal, seasonal_length),
      enforce_stationarity=False,
      enforce_invertibility=False
    )
    fitted_model = model.fit()

    forecast_result = fitted_model.get_forecast(steps=forecast_steps)

    forecast = forecast_result.predicted_mean
    confidence_intervals = forecast_result.conf_int()

    lower_ci = confidence_intervals.iloc[:, 0]
    upper_ci = confidence_intervals.iloc[:, 1]

    prediction_in_sample = fitted_model.predict(
      start=0,
      end=len(series_clean) - 1
    )

    rmse_value = np.sqrt(
      mean_squared_error(
        series_clean[d:],
        prediction_in_sample[d:]
      )
    )

    params_series = fitted_model.params

    ar_coefs: [str] = []
    ar_seasonal_coefs: [str] = []
    ma_coefs: [str] = []
    ma_seasonal_coefs: [str] = []
    intercept = None
    sigma2 = None

    for name, value in params_series.items():
      if "ar.S" in name:
        ar_seasonal_coefs.append(f"{name}={value}")
      elif "ar" in name:
        ar_coefs.append(f"{name}={value}")
      elif "sigma2" in name:
        sigma2 = float(value)
      elif "ma.S" in name:
        ma_seasonal_coefs.append(f"{name}={value}")
      elif "ma" in name:
        ma_coefs.append(f"{name}={value}")
      elif "intercept" in name or "const" in name:
        intercept = float(value)

    if sigma2 is None and hasattr(fitted_model, "sigma2"):
      sigma2 = float(fitted_model.sigma2)

    forecast_index = list(range(len(forecast)))

    results = TaskResults(
      params={
        "p": safe_metric(float(p)),
        "d": safe_metric(float(d)),
        "q": safe_metric(float(q)),
        "p_seasonal": safe_metric(float(p_seasonal)),
        "d_seasonal": safe_metric(float(d_seasonal)),
        "q_seasonal": safe_metric(float(q_seasonal)),
        "seasonal_length": safe_metric(float(seasonal_length)),
        "aic": safe_metric(float(fitted_model.aic)),
        "bic": safe_metric(float(fitted_model.bic)),
        "rmse": safe_metric(float(rmse_value)),
        "sigma2": safe_metric(float(sigma2)) if sigma2 is not None else 0.0,
        "intercept": safe_metric(float(intercept)) if intercept is not None else 0.0,
      },
      table={
        "forecast": pd.Series(forecast.values, index=forecast_index),
        "lower_ci": pd.Series(lower_ci.values, index=forecast_index),
        "upper_ci": pd.Series(upper_ci.values, index=forecast_index),
        "coefficients_ar": pd.Series(ar_coefs),
        "coefficients_ma": pd.Series(ma_coefs),
        "coefficients_ar_seasonal": pd.Series(ar_seasonal_coefs),
        "coefficients_ma_seasonal": pd.Series(ma_seasonal_coefs),
      }
    )
    return await task.complete(results=results)
  except Exception as error:
    print(error, flush=True)
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('adf')
async def handle_adf(task: Task):
  try:
    series = task.columns.items.get("target-series")
    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    result = adfuller(series)

    return await task.complete(
      results=TaskResults(
        params={
          "adf-statistic": result[0],
          "p-value": result[1],
          "used_lag": result[2],
          "n_observations": result[3],
          "critical_1": result[4].get('1%', None),
          "critical_5": result[4].get('5%', None),
          "critical_10": result[4].get('10%', None),
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

async def main():
  adapter = Adapter(extension_name="time-series")
  event = await adapter.connect()
  print("🚀 Service started", flush=True)
  await asyncio.Event().wait()

if __name__ == "__main__":
  asyncio.run(main())