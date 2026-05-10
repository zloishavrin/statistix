# STATISTIX | Worker Adapter Library

![Type](https://img.shields.io/badge/type-sdk%20%7C%20adapter-purple)
![Language](https://img.shields.io/badge/python-async-blue)
![Usage](https://img.shields.io/badge/usage-worker%20runtime-green)

---

## 📌 Overview

**STATISTIX Adapter** is a lightweight Python SDK used by all computational worker services in the Statistix ecosystem.

It abstracts away all infrastructure complexity:

- RabbitMQ message handling
- S3 file access
- Task routing logic
- Data serialization / deserialization
- Result publishing pipeline

and provides a **declarative event-driven programming model** for writing worker logic.

---

## 🧠 Core Idea

Instead of writing infrastructure code, workers only define:

> “What should happen when a specific task arrives”

Everything else is handled by the Adapter.

---

## 🚀 Key Benefits

### ⚡ 1. Zero infrastructure logic in workers

Workers do NOT need to know:
- where messages come from (RabbitMQ)
- where results go
- how retries work
- how serialization is handled

---

### 🧩 2. Declarative execution model

Workers are written as event handlers:

- `@event.on("method-name")`
- pure business logic only
- fully async execution

---

### 📦 3. Built-in data orchestration

Adapter automatically provides:

- parsed parameters
- preloaded tables (CSV/XLS/XLSX → pandas)
- S3 file resolution
- type-safe Task object

---

### 📊 4. UI-ready results pipeline

Everything returned by worker is automatically:

- serialized
- stored (S3 if needed)
- mapped into frontend-compatible structure
- visualized in Statistix UI

---

## 🧱 Core Concept: Task Object

Every worker function receives a **Task instance**.

```python
@event.on("example-task")
async def handler(task: Task):
```

### 📦 Task Object Structure

The Task object contains all execution context:

**🔹 Identity**
- task.id → unique task identifier
- task.language → user locale (for i18n)

**🔹 Parameters**

```python
task.params.items
```

Dictionary-like structure:

- key → parameter name
- value → numeric value

Used for:

- statistical tests
- model parameters
- configuration values

**🔹 Input Tables**

```python
task.columns
task.tables
```

Automatically resolved from S3 + MongoDB metadata:

- columns → Series-based selection
- tables → full DataFrames

Workers receive ready-to-use pandas objects.

**🔹 Execution API**

The Task object provides two main outcomes:

✅ Success

```python
await task.complete(results=TaskResults(...))
```

Used when computation succeeds.

❌ Failure

```python
await task.failed(error_message="...")
```

Used when:

- invalid input
- computation error
- missing data
- runtime exception

---

### 📊 TaskResults Object

Used in successful execution:

```python
TaskResults(
  params={...},
  table={...},
  tables={...}
)
```

**Supported outputs:**

1. Parameters

```python
params: dict[str, float]
```

Used for:

- statistical values
- computed metrics
- scalar results

2. Single table output

```python
table: dict[str, pd.Series]
```

Used for:

- column-level results
- vector outputs

3. Multiple tables output

```python
tables: dict[str, pd.DataFrame]
```

Used for:

- matrix results
- grouped outputs
- experimental outputs (e.g. expected frequencies)

---

### 📤 Result Delivery Pipeline

When task.complete() is called:

Adapter automatically:

1. Combines all DataFrames
2. Converts to CSV
3. Uploads result to S3
4. Maps column metadata for UI
5. Sends message to Task Service
6. Triggers frontend update pipeline

👉 Worker does NOT handle any of this manually.

---

### ❌ Error Handling

When task.failed() is called:

Adapter:

wraps error in standardized DTO
sends failure event to Task Service
triggers notification pipeline
updates task status in UI

Recommended usage:

```python
return await task.failed(error_message="invalid_data")
```

---

### ⚙️ Event System

Workers register handlers using decorator syntax:

```python
@event.on("chi-square-test-ind")
async def handler(task: Task):
    ...
```

**Behavior:**
- event name = RabbitMQ routing key suffix
- automatically mapped to queue binding
- fully async execution
- no manual message parsing required

---

### 🔁 Execution Flow

1. Task Service sends message via RabbitMQ
2. Adapter consumes message
3. Parses:
- params
- tables
- metadata
4. Creates Task instance
5. Dispatches to registered handler
6. Worker executes logic
7. Calls:
- complete() OR failed()
8. Adapter handles full response pipeline

---

### 🗄 Storage Integration

Adapter includes built-in S3 integration:

- automatically fetches input files
- converts to pandas DataFrame
- resolves column mapping
- supports CSV/XLS/XLSX

Workers never interact with S3 directly.

---

### 🌍 Internationalization

Each Task includes:

```python
task.language
```

Used for:

- error messages
- localized validation output
- UI-friendly messaging

---

## 🧠 Design Philosophy

This SDK is designed around:

1. Separation of concerns

Workers = business logic only

---

2. Infrastructure abstraction
- no RabbitMQ code
- no S3 code
- no serialization code

---

3. Declarative execution
- handlers define what
- adapter handles how

--- 

4. UI-first output model

Everything is structured for:

- charts
- tables
- parameter visualization
- frontend rendering

---

## 📌 Example Worker

```python
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
```

Worker responsibilities:

- validate input
- compute result
- return structured TaskResults

Nothing else.

---

## 🧱 Adapter Initialization

```python
adapter = Adapter(extension_name="statistics")
await adapter.connect()
```

Behavior:

- connects to RabbitMQ
- binds extension queue
- initializes storage access