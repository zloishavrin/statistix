# STATISTIX

<p align="center">
  <img src="./assets/statistix-banner.png" alt="STATISTIX Banner" width="100%" />
</p>

<p align="center">
  <strong>Distributed Open-Source Analytics Platform</strong>
</p>

<p align="center">
  Schema-driven analytics • Plugin-based workers • Event-driven architecture • Self-hosted
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <img src="https://img.shields.io/badge/backend-NestJS-red" />
  <img src="https://img.shields.io/badge/workers-Python-yellow" />
  <img src="https://img.shields.io/badge/broker-RabbitMQ-orange" />
  <img src="https://img.shields.io/badge/storage-S3-green" />
  <img src="https://img.shields.io/badge/database-MongoDB-brightgreen" />
</p>

---

# What is STATISTIX?

**STATISTIX** is an open-source distributed analytics platform built for statistical computing, time-series analysis, data processing, and extensible analytical workloads.

It combines:

* ⚡ Event-driven microservices
* 🧩 Plugin-based worker architecture
* 📦 Declarative JSON extension system
* 🐳 Self-hosted Docker infrastructure
* 🌍 Multilingual metadata support
* 🔬 Statistical and time-series computation
* 🚀 Horizontally scalable workers

STATISTIX is designed as a **schema-driven compute platform** where analytical services are described declaratively and executed through distributed workers.

---

# Core Philosophy

STATISTIX is built around one idea:

> Analytics should be extensible, declarative, distributed, and self-hosted.

Instead of hardcoding analytical pipelines directly into backend services, STATISTIX separates:

* execution logic
* runtime orchestration
* schema contracts
* worker implementations
* infrastructure

This allows new analytical capabilities to be added without rewriting the platform core.


# Extension System

One of the core features of STATISTIX is the **extension system**.

Extensions are declarative JSON schemas describing:

* services
* methods
* input contracts
* output contracts
* localized metadata

Example:

```json
{
  "service_name": "statistics",
  "methods": [
    {
      "id": "linear_regression",
      "input": {
        "columns": [...]
      },
      "output": {
        "params": [...]
      }
    }
  ]
}
```

This allows:

* automatic UI generation
* runtime discovery
* pluggable analytics
* multilingual interfaces
* stable execution contracts

---

# Adapter Layer

The adapter is the heart of the platform runtime.

It is responsible for:

* parsing extension configs
* validating schemas
* normalizing contracts
* mapping methods to execution handlers
* localization resolution
* runtime registration

The adapter transforms:

```text
Extension Config → Runtime Schema → Worker Execution
```

This abstraction makes the platform extensible without tightly coupling services together.

---

# Event-Driven Infrastructure

STATISTIX uses RabbitMQ as the central event and job broker.

Why?

Because analytical workloads are:

* asynchronous
* compute-heavy
* scalable
* distributed by nature

Benefits:

* horizontal scaling
* queue-based execution
* fault tolerance
* worker isolation
* backpressure handling
* decoupled services

---

# Frontend

The frontend is designed as a dynamic analytics interface powered by extension schemas.

Capabilities include:

* automatic method rendering
* multilingual UI
* schema-based forms
* result visualization
* workflow execution
* analytical dashboards

Because methods are declarative, the frontend can dynamically render interfaces directly from extension metadata.

---

# Technology Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Backend        | NestJS / FastAPI           |
| Workers        | Python                     |
| Messaging      | RabbitMQ                   |
| Storage        | MinIO / Any AWS supported  |
| Database       | MongoDB                    |
| Infrastructure | Docker / Docker Swarm      |
| Frontend       | React                      |
| Config System  | JSON Schema-like Contracts |

---

# Why STATISTIX?

Most analytics systems are:

* monolithic
* difficult to extend
* tightly coupled to UI/backend
* cloud-dependent
* hard to self-host

STATISTIX is different.

It provides:

✅ Distributed execution

✅ Open plugin architecture

✅ Self-hosted deployment

✅ Declarative analytics contracts

✅ Infrastructure independence

✅ Multilingual metadata system

✅ Scalable worker model

✅ Event-driven orchestration

---

# Running Locally

## Requirements

* Docker
* Docker Compose

---

## Clone Repository

```bash
git clone https://github.com/zloishavrin/statistix
cd statistix
```

---

## Start Infrastructure

```bash
docker compose up --build
```

---

## Example Worker Registration

```yaml
worker-statistics:
  build:
    context: ./workers/worker_statistics
    dockerfile: Dockerfile.dev
  depends_on:
    - minio
    - mongodb
    - rabbitmq
  volumes:
    - ./workers/worker_statistics:/usr/src/worker-statistics
  env_file:
    - ./.env
  command: watchmedo auto-restart --patterns=*.py --recursive --directory=src python src/main.py
```

---

# Scalability

STATISTIX is designed for horizontal scaling.

You can:

* scale workers independently
* distribute workloads across queues
* isolate analytical domains
* add new worker types dynamically

---

# Open Source

STATISTIX is fully open-source under the MIT License.

This means you can:

* use it commercially
* self-host it
* modify workers
* build proprietary extensions
* contribute to the ecosystem

---

# Vision

STATISTIX aims to become:

> A modular distributed analytics ecosystem for statistical computing and analytical workflows.

Not just another backend.

Not just another dashboard.

But a platform where analytical computation becomes:

* composable
* distributed
* extensible
* infrastructure-agnostic

---

# Contributing

Contributions are welcome.

Areas especially needed:

* new analytical workers
* ML extensions
* distributed execution improvements
* visualization components
* adapter improvements
* schema versioning
* Kubernetes deployment
* observability/monitoring

---

# License

MIT License.

---

# Final Notes

STATISTIX is designed for engineers, analysts, researchers, and teams who need:

* scalable analytics
* self-hosted infrastructure
* extensible computation
* event-driven execution
* plugin-based analytical systems

If you want a lightweight analytics runtime that can grow into a distributed compute platform — STATISTIX is built for that.
