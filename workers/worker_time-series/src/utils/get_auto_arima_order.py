from pmdarima import auto_arima

def get_auto_arima_order(series, params):
  p_param = params.get("p")
  d_param = params.get("d")
  q_param = params.get("q")

  model = auto_arima(
    series,
    start_p=int(p_param) if p_param is not None else 0,
    start_q=int(q_param) if q_param is not None else 0,
    max_p=5,
    max_q=5,
    max_d=2,
    d=int(d_param) if d_param is not None else None,
    seasonal=False,
    stepwise=True,
    suppress_warnings=True,
    error_action="ignore"
  )

  return model.order