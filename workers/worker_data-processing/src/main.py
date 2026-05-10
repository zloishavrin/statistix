import asyncio
import signal
from adapter import Adapter, event, Task, TaskResults
from core.config import config
from core.tranlations import t
from scipy.stats import boxcox
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import pandas as pd
from sklearn.metrics import mean_squared_error

@event.on('box_cox')
async def handle_box_cox(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if task.params is not None:
      lambda_value = task.params.get("lambda")
    else:
      lambda_value = None

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    series_clean = pd.to_numeric(series, errors='coerce').dropna()

    if (series_clean <= 0).any():
      return await task.failed(error_message=t(task.language, 'series_is_only_positive'))
    
    if lambda_value is None:
      transformed, fitted_lambda = boxcox(series_clean)
    else:
      transformed = boxcox(s_clean, lmbda=lambda_value)
      fitted_lambda = lambda_value
    
    transformed_series = pd.Series(transformed, index=series_clean.index)

    return await task.complete(
      results=TaskResults(
        params={
          "lambda": fitted_lambda,
        },
        table={
          "data-series": transformed_series,
        },
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('z_score_standardization')
async def handle_z_score(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    series_clean = pd.to_numeric(series, errors='coerce').dropna()

    mean_value = series_clean.mean()
    std_value = series_clean.std(ddof=0)

    if std_value == 0:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    z_scores = (series_clean - mean_value) / std_value
    z_scores_series = pd.Series(z_scores, index=series_clean.index)

    return await task.complete(
      results=TaskResults(
        params={
          "mean": mean_value,
          "std": std_value,
        },
        table={
          "z-score-series": z_scores_series,
        },
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('min_max_scaling')
async def handle_min_max_scaling(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    series_clean = pd.to_numeric(series, errors='coerce').dropna()

    min_target = 0
    max_target = 1

    if task.params is not None:
      if task.params.items.get("min") is not None:
        min_target = task.params.items.get("min")
      if task.params.items.get("max") is not None:
        max_target = task.params.items.get("max")

    min_value = series_clean.min()
    max_value = series_clean.max()

    if max_value == min_value:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    scaled = (series_clean - min_value) / (max_value - min_value)
    scaled = scaled * (max_target - min_target) + min_target

    scaled_series = pd.Series(scaled, index=series_clean.index)

    return await task.complete(
      results=TaskResults(
        table={
          "scaled-series": scaled_series,
        },
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('train_test_split')
async def handle_train_test_split(task: Task):
  try:
    dataset = task.tables.items.get("dataset")

    if dataset is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    test_size = task.params.items.get("test_size")
    if test_size is None:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    shuffled_dataset = dataset.sample(frac=1).reset_index(drop=True)
    test_size_count = int(len(shuffled_dataset) * test_size)

    train_set = prefix_columns(
      shuffled_dataset.iloc[test_size_count:],
      "train"
    )

    test_set = prefix_columns(
      shuffled_dataset.iloc[:test_size_count],
      "test"
    )

    return await task.complete(
      results=TaskResults(
        tables={
          "train-set": train_set,
          "test-set": test_set,
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('one-hot-encoding')
async def handle_one_hot_encoding(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    encoding_table = pd.get_dummies(series, prefix=series.name)
    return await task.complete(
      results=TaskResults(
        tables={
          "encoding-table": encoding_table.astype(int),
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('fill-mean')
async def handle_fill_mean(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    missing_count = series.isna().sum()
    mean_value = series.mean()
    filled_series = series.fillna(mean_value)

    return await task.complete(
      results=TaskResults(
        params={
          "missing": missing_count,
        },
        table={
          "filled-series": filled_series,
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('fill-median')
async def handle_fill_median(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    missing_count = series.isna().sum()
    median_value = series.median()
    filled_series = series.fillna(median_value)

    return await task.complete(
      results=TaskResults(
        params={
          "missing": missing_count,
        },
        table={
          "filled-series": filled_series,
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('fill-mode')
async def handle_fill_mode(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    missing_count = series.isna().sum()

    mode_values = series.mode()
    fill_value = mode_values.iloc[0] if not mode_values.empty else None
    if fill_value is None:
      return await task.failed(error_message=t(task.language, 'not_found_mode'))

    filled_series = series.fillna(fill_value)

    return await task.complete(
      results=TaskResults(
        params={
          "missing": missing_count,
        },
        table={
          "filled-series": filled_series,
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('fill-linear-interpolation')
async def handle_fill_mode(task: Task):
  try:
    series = task.columns.items.get("data-series")

    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    missing_count = series.isna().sum()

    mode_values = series.mode()
    filled_series = series.interpolate(method='linear')

    return await task.complete(
      results=TaskResults(
        params={
          "missing": missing_count,
        },
        table={
          "filled-series": filled_series,
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

def prefix_columns(df: pd.DataFrame, prefix: str) -> pd.DataFrame:
  df = df.copy()
  df.columns = [f"{prefix}__{col}" for col in df.columns]
  return df

async def main():
  adapter = Adapter(extension_name="data-processing")
  event = await adapter.connect()
  print("🚀 Service started", flush=True)
  await asyncio.Event().wait()

if __name__ == "__main__":
  asyncio.run(main())