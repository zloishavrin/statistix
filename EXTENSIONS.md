# EXTENSIONS.md

## Overview

This document describes how external extensions (services/workers) are integrated into the system, how their configuration is structured, and how the system interprets and executes them via the **adapter layer**.

Extensions are defined as declarative JSON configurations that describe:

* a service (worker)
* its methods
* inputs and outputs
* localized metadata

The system does not execute raw code directly from extensions. Instead, it relies on a **unified adapter layer** that transforms configuration into an internal executable schema.

---

## Adapter Layer

The **adapter** is a core component responsible for:

* Parsing extension JSON configurations
* Validating schema compliance
* Normalizing input/output definitions
* Mapping declared methods to internal execution handlers
* Resolving localized metadata (`localized_meta`)
* Building a unified runtime representation of services and methods

### Responsibilities

1. **Schema validation**

   * Ensures all required fields exist
   * Validates structure of `methods`, `input`, `output`

2. **Normalization**

   * Converts `columns`, `params`, and `multiple_columns` into a unified internal format

3. **Execution mapping**

   * Maps `service_name + method_id` → internal handler registry

4. **Localization resolution**

   * Selects correct language version from `localized_meta` based on runtime locale

---

## Extension Configuration Schema

Each extension is defined as a JSON object with the following top-level structure:

```json
{
  "service_name": "string",
  "localized_meta": {
    "<lang>": {
      "title": "string",
      "description": "string"
    }
  },
  "methods": [ ... ]
}
```

### 1. service_name

Unique identifier of the service/worker.

Example:

```json
"service_name": "statistics"
```

---

### 2. localized_meta (Service level)

Provides multilingual metadata for UI/display purposes.

```json
"localized_meta": {
  "en": {
    "title": "Statistics",
    "description": "Basic statistical analysis"
  },
  "ru": {
    "title": "Статистика",
    "description": "Базовый статистический анализ"
  }
}
```

---

### 3. methods

Array of executable methods exposed by the service.

Each method has:

* id
* localized_meta
* input definition
* output definition

---

## Method Schema

```json
{
  "id": "method_name",
  "localized_meta": { ... },
  "input": { ... },
  "output": { ... }
}
```

---

## Input Schema

Inputs can be defined using:

### 1. columns (single column input)

Used for single series / vector input.

```json
"columns": [
  {
    "id": "data-series",
    "localized_meta": {
      "en": {
        "title": "Data series",
        "description": "Input numeric series"
      }
    }
  }
]
```

---

### 2. multiple_columns (table input)

Used for datasets or matrices.

```json
"multiple_columns": [
  {
    "id": "factors-table",
    "localized_meta": {
      "en": {
        "title": "Feature matrix",
        "description": "Independent variables"
      }
    }
  }
]
```

---

### 3. params (scalar parameters)

Used for numeric/string configuration values.

```json
"params": [
  {
    "id": "forecast_steps",
    "required": true,
    "min": 1,
    "max": 100,
    "localized_meta": {
      "en": {
        "title": "Forecast horizon",
        "description": "Number of steps ahead"
      }
    }
  }
]
```

---

## Output Schema

Outputs mirror input structure and can include:

* params (scalar outputs)
* columns (single-column results)
* multiple_columns (tables/matrices)

Example:

```json
"output": {
  "params": [
    {
      "id": "mean",
      "localized_meta": {
        "en": {
          "title": "Mean",
          "description": "Average value"
        }
      }
    }
  ]
}
```

---

## Example Extensions

Below are simplified examples of full service configurations.

---

## Example 1: Statistics Service

```json
{
  "service_name": "statistics",
  "localized_meta": {
    "en": {
      "title": "Statistics",
      "description": "Basic statistical analysis and hypothesis testing"
    },
    "ru": {
      "title": "Статистика",
      "description": "Базовый статистический анализ и проверка гипотез"
    }
  },
  "methods": [ ... ]
}
```

Includes methods such as:

* summary_stats
* linear_regression
* pearson_correlation
* t-tests
* chi-square tests

---

## Example 2: Time Series Service

```json
{
  "service_name": "time-series",
  "localized_meta": {
    "en": {
      "title": "Time Series",
      "description": "Forecasting and analysis of sequential data"
    },
    "ru": {
      "title": "Временные ряды",
      "description": "Анализ и прогнозирование временных рядов"
    }
  },
  "methods": [ ... ]
}
```

Includes methods such as:

* ARIMA
* SARIMA
* ADF test
* forecasting utilities

---

## Configuration Rules

To ensure compatibility with the system adapter:

### Required rules

* `service_name` must be unique
* Each `method.id` must be unique within a service
* `localized_meta` must contain at least one language (recommended: `en`)
* Inputs must be explicitly typed as `columns`, `multiple_columns`, or `params`
* Outputs must follow the same structure rules

### Naming conventions

* Use `snake_case` or `kebab-case` for IDs
* Avoid spaces in identifiers

### Validation constraints

* `min`, `max` only apply to numeric params
* `required` must be explicitly declared when applicable

---

## Adapter Compatibility Summary

The adapter ensures that every extension is transformed into a unified internal representation:

```
JSON config → Adapter → Internal execution graph → Runtime worker
```

This abstraction allows:

* pluggable services
* consistent UI rendering
* multilingual support
* unified execution layer

---

## Deployment via Docker Compose / Docker Swarm

In addition to defining extensions as JSON configurations, each service and worker must be explicitly registered in the orchestration layer (Docker Compose or Docker Swarm). This ensures that the adapter can access the corresponding worker runtime and that configuration files are correctly mounted into each container at startup.

Each worker service is expected to be deployed as an independent container with its own isolated runtime environment. The configuration files (e.g. `*.worker-config.json`) must be mounted into the service container via volumes, allowing the adapter layer inside the runtime to dynamically load and register available methods at startup.

For example, a central task service (`service-task`) acts as an orchestration and dispatch layer, consuming worker configurations for all registered services (such as `statistics`, `time-series`, and `data-processing`). This service depends on shared infrastructure components such as message brokers and storage systems (e.g. RabbitMQ, MongoDB, MinIO), which are declared via `depends_on` to guarantee proper initialization order.

Each worker (e.g. `worker-statistics`, `worker-time-series`) is deployed as a separate service definition in `docker-compose.yml` or a Swarm stack file. These workers run independently and are responsible for executing domain-specific logic defined in their corresponding configuration files and runtime code. The `watchmedo` development command is used in development environments to enable hot-reloading of worker logic during iteration.

In production (Docker Swarm), these services should be scaled independently, with configuration files versioned and injected via immutable volume mounts or config objects. This allows horizontal scaling of workers without modifying the core adapter logic, while preserving a consistent contract between configuration, execution, and orchestration layers.

## Conclusion

Extension configuration is strictly declarative and schema-driven. The adapter is responsible for transforming these configurations into executable system components, ensuring consistency across all services and methods.