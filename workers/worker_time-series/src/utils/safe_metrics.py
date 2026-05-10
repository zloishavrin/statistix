import numpy as np

def safe_metric(x):
  if x is None or not np.isfinite(x):
    return None
  return float(x)