from pmdarima import auto_arima


def get_auto_sarima_order(series, params, seasonal_length=12):
  print(series, flush=True)

  p_param = params.get("p")
  d_param = params.get("d")
  q_param = params.get("q")

  p_s_param = params.get("p_seasonal")
  d_s_param = params.get("d_seasonal")
  q_s_param = params.get("q_seasonal")

  model = auto_arima(
    series,
    seasonal=True,
    m=seasonal_length,
    start_p=int(p_param) if p_param is not None else 0,
    start_q=int(q_param) if q_param is not None else 0,
    start_P=int(p_s_param) if p_s_param is not None else 0,
    start_Q=int(q_s_param) if q_s_param is not None else 0,
    d=int(d_param) if d_param is not None else None,
    D=int(d_s_param) if d_s_param is not None else None,
    max_p=5,
    max_q=5,
    max_d=5,
    max_P=5,
    max_Q=5,
    max_D=5,
    stepwise=True,
    suppress_warnings=True,
    error_action="raise"
  )

  order = model.order
  seasonal_order = model.seasonal_order

  return order[0], order[1], order[2], seasonal_order[0], seasonal_order[1], seasonal_order[2]