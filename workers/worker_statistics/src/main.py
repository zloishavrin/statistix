import asyncio
import signal
from adapter import Adapter, event, Task, TaskResults
from core.config import config
from core.tranlations import t
from scipy.stats import boxcox, pearsonr, spearmanr, kendalltau, ttest_1samp, ttest_ind, f_oneway, shapiro, chisquare, chi2_contingency
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error

@event.on('summary_stats')
async def handle_summary_stats(task: Task):
  try:
    series = task.columns.items.get("data-series")
    if series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    return await task.complete(
      results=TaskResults(
        params={
          "count": series.count(),
          "missing": series.isna().sum(),
          "mean": series.mean(),
          "q1": series.quantile(0.25),
          "median": series.median(),
          "q3": series.quantile(0.75),
          "iqr": series.quantile(0.75) - series.quantile(0.25),
          "min": series.min(),
          "max": series.max(),
          "variance": series.var(),
          "std": series.std(),
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('linear_regression')
async def handle_linear_regression(task: Task):
  try:
    target_series = task.columns.items.get("target-series")
    factors_table = task.tables.items.get("factors-table")

    if target_series is None or factors_table is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    model = LinearRegression()
    model.fit(factors_table, target_series)

    index = list(range(len(factors_table.columns)))

    coef = pd.Series(model.coef_.astype(float), index=index)
    importance = coef.abs()

    feature_names = [
      str(col) if col is not None and str(col).strip() != "" else t(task.language, 'unnamed')
      for col in factors_table.columns
    ]

    prediction = model.predict(factors_table)

    r2_value = r2_score(target_series, prediction)
    mse_value = mean_squared_error(target_series, prediction)
    mae_value = mean_absolute_error(target_series, prediction)

    return await task.complete(
      results=TaskResults(
        params={
          "r2": r2_value,
          "mse": mse_value,
          "mae": mae_value,
        },
        table={
          "feature_name": pd.Series(feature_names, index=index),
          "coef": coef,
          "importance": importance,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('pearson_correlation')
async def handle_pearson_correlation(task: Task):
  try:
    target_table = task.tables.items.get("target-table")

    if target_table is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    numeric_table = target_table.select_dtypes(include='number')

    if numeric_table.shape[1] < 2:
      return await task.failed(error_message=t(task.language, 'need_2_number_series'))

    correlation_matrix = numeric_table.corr(method='pearson')
    correlation_matrix = correlation_matrix.reset_index().rename(columns={'index': 'feature'})

    header_row = [''] + list(numeric_table.columns)

    correlation_matrix.loc[-1] = header_row
    correlation_matrix.index = correlation_matrix.index + 1
    correlation_matrix = correlation_matrix.sort_index()

    cols = numeric_table.columns
    p_value_matrix = pd.DataFrame(np.ones((len(cols), len(cols))), columns=cols, index=cols)

    for i in cols:
        for j in cols:
            if i == j:
                p_value_matrix.loc[i, j] = 0.0
            else:
                _, p = pearsonr(numeric_table[i], numeric_table[j])
                p_value_matrix.loc[i, j] = p

    p_value_matrix = p_value_matrix.reset_index().rename(columns={'index': 'feature'})

    p_value_matrix.loc[-1] = header_row
    p_value_matrix.index = p_value_matrix.index + 1
    p_value_matrix = p_value_matrix.sort_index()

    p_value_matrix = prefix_columns(p_value_matrix, "p_value")

    return await task.complete(
      results=TaskResults(
        tables={
          "correlation_matrix": correlation_matrix,
          "p_value": p_value_matrix,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('spearman_correlation')
async def handle_spearman_correlation(task: Task):
  try:
    target_table = task.tables.items.get("target-table")

    if target_table is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    numeric_table = target_table.select_dtypes(include='number')

    if numeric_table.shape[1] < 2:
      return await task.failed(error_message=t(task.language, 'need_2_number_series'))

    correlation_matrix = numeric_table.corr(method='spearman')
    correlation_matrix = correlation_matrix.reset_index().rename(columns={'index': 'feature'})

    header_row = [''] + list(numeric_table.columns)

    correlation_matrix.loc[-1] = header_row
    correlation_matrix.index = correlation_matrix.index + 1
    correlation_matrix = correlation_matrix.sort_index()

    cols = numeric_table.columns

    p_value_matrix = pd.DataFrame(
      np.ones((len(cols), len(cols))),
      columns=cols,
      index=cols
    )

    for i in cols:
      for j in cols:
        if i == j:
          p_value_matrix.loc[i, j] = 0.0
        else:
          _, p = spearmanr(numeric_table[i], numeric_table[j])
          p_value_matrix.loc[i, j] = p

    p_value_matrix = p_value_matrix.reset_index().rename(columns={'index': 'feature'})

    p_value_matrix.loc[-1] = header_row
    p_value_matrix.index = p_value_matrix.index + 1
    p_value_matrix = p_value_matrix.sort_index()

    p_value_matrix = prefix_columns(p_value_matrix, "p_value")

    return await task.complete(
      results=TaskResults(
        tables={
          "correlation_matrix": correlation_matrix,
          "p_value": p_value_matrix,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('kendall_correlation')
async def handle_kendall_correlation(task: Task):
  try:
    target_table = task.tables.items.get("target-table")

    if target_table is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    numeric_table = target_table.select_dtypes(include='number')

    if numeric_table.shape[1] < 2:
      return await task.failed(error_message=t(task.language, 'need_2_number_series'))

    correlation_matrix = numeric_table.corr(method='kendall')
    correlation_matrix = correlation_matrix.reset_index().rename(columns={'index': 'feature'})

    header_row = [''] + list(numeric_table.columns)

    correlation_matrix.loc[-1] = header_row
    correlation_matrix.index = correlation_matrix.index + 1
    correlation_matrix = correlation_matrix.sort_index()

    cols = numeric_table.columns

    p_value_matrix = pd.DataFrame(
      np.ones((len(cols), len(cols))),
      columns=cols,
      index=cols
    )

    for i in cols:
      for j in cols:
        if i == j:
          p_value_matrix.loc[i, j] = 0.0
        else:
          _, p = kendalltau(numeric_table[i], numeric_table[j])
          p_value_matrix.loc[i, j] = p

    p_value_matrix = p_value_matrix.reset_index().rename(columns={'index': 'feature'})

    p_value_matrix.loc[-1] = header_row
    p_value_matrix.index = p_value_matrix.index + 1
    p_value_matrix = p_value_matrix.sort_index()

    p_value_matrix = prefix_columns(p_value_matrix, "p_value")

    return await task.complete(
      results=TaskResults(
        tables={
          "correlation_matrix": correlation_matrix,
          "p_value": p_value_matrix,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('one-sample-t-test')
async def handle_one_sample_t_test(task: Task):
  try:
    target_series = task.columns.items.get("target-series")
    if target_series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    popmean = task.params.items.get("popmean")
    if popmean is None:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    result = ttest_1samp(target_series, popmean=popmean)

    return await task.complete(
      results=TaskResults(
        params={
          "t-statistic": result.statistic,
          "p-value": result.pvalue,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('t-test-ind-student')
async def handle_t_test_ind_student(task: Task):
  try:
    first_target_series = task.columns.items.get("first-target-series")
    if first_target_series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    second_target_series = task.columns.items.get("second-target-series")
    if second_target_series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    result = ttest_ind(
      first_target_series,
      second_target_series,
      equal_var=True
    )

    return await task.complete(
      results=TaskResults(
        params={
          "t-statistic": result.statistic,
          "p-value": result.pvalue,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('t-test-ind-welch')
async def handle_t_test_ind_welch(task: Task):
  try:
    first_target_series = task.columns.items.get("first-target-series")
    if first_target_series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    second_target_series = task.columns.items.get("second-target-series")
    if second_target_series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    result = ttest_ind(
      first_target_series,
      second_target_series,
      equal_var=False
    )

    return await task.complete(
      results=TaskResults(
        params={
          "t-statistic": result.statistic,
          "p-value": result.pvalue,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('anova')
async def handle_anova(task: Task):
  try:
    target_table = task.tables.items.get("target-table")
    if target_table is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    groups = []
    for col in target_table.columns:
      series = target_table[col].dropna().values
      if len(series) > 0:
        groups.append(series)

    if len(groups) < 2:
      return await task.failed(error_message=t(task.language, 'invalid_data'))

    result = f_oneway(*groups)

    return await task.complete(
      results=TaskResults(
        params={
          "f-statistic": result.statistic,
          "p-value": result.pvalue,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('shapiro-wilk-test')
async def handle_shapiro_wilk_test(task: Task):
  try:
    target_series = task.columns.items.get("target-series")
    if target_series is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    result = shapiro(target_series)

    return await task.complete(
      results=TaskResults(
        params={
          "w-statistic": result.statistic,
          "p-value": result.pvalue,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('chi-square-goodness-of-fit')
async def handle_chi_square_goodness_of_fit(task: Task):
  try:
    obs_freq = task.columns.items.get("obs_freq")
    exp_freq = task.columns.items.get("exp_freq")
    if obs_freq is None or exp_freq is None:
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    result = chisquare(f_obs=obs_freq, f_exp=exp_freq)

    return await task.complete(
      results=TaskResults(
        params={
          "chi2-statistic": result.statistic,
          "p-value": result.pvalue,
        }
      )
    )
  except Exception as error:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

@event.on('chi-square-test-ind')
async def handle_chi_square_test_ind(task: Task):
  try:
    target_table = task.tables.items.get("target-table")
    if target_table is None or not isinstance(target_table, pd.DataFrame):
      return await task.failed(error_message=t(task.language, 'not_found_series'))

    observed = target_table.values

    chi2_value, p_value, dof, expected = chi2_contingency(observed)

    exp_freq = pd.DataFrame(
        expected,
        index=target_table.index,
        columns=target_table.columns
    )

    return await task.complete(
      results=TaskResults(
        params={
          "chi2-statistic": chi2_value,
          "p-value": p_value,
          "dof": dof,
        },
        tables={
          "exp_freq": exp_freq,
        }
      )
    )
  except:
    return await task.failed(error_message=t(task.language, 'invalid_data'))

def prefix_columns(df: pd.DataFrame, prefix: str) -> pd.DataFrame:
  df = df.copy()
  df.columns = [f"{prefix}__{col}" for col in df.columns]
  return df

async def main():
  adapter = Adapter(extension_name="statistics")
  event = await adapter.connect()
  print("🚀 Service started", flush=True)
  await asyncio.Event().wait()

if __name__ == "__main__":
  asyncio.run(main())