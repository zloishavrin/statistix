# STATISTIX | Task Service

![Framework](https://img.shields.io/badge/framework-NestJS-red)
![Database](https://img.shields.io/badge/database-MongoDB-green)
![Messaging](https://img.shields.io/badge/messaging-RabbitMQ-orange)

---

## 📌 Description

**STATISTIX Task Service** is a backend service responsible for managing **extensions and task execution lifecycle** within the Statistix platform.

It is built with **NestJS** and serves as the core orchestration layer between:

- Extension configurations
- Task creation and processing
- Worker services (via RabbitMQ)
- File storage metadata (MongoDB file collection)
- Notification system

The service ensures that user-defined computational tasks are properly validated, routed, executed, and tracked.

---

## 🚀 Features

### ⚙️ Task Management

The `task` module is responsible for:

- Creating user tasks
- Validating task payloads
- Mapping task input to extension schemas
- Enriching tasks with metadata (column names, parameter definitions, descriptions)
- Retrieving task execution results and status

Each task represents a **unit of distributed computation** processed asynchronously.

---

### 🧩 Extensions System

The `extensions` module handles:

- Loading extension configurations from external sources (Docker-mounted JSON files)
- Runtime validation of configs using **Zod**
- In-memory storage of validated extension definitions
- Providing extension schemas to other modules for validation and mapping

These extensions define:
- Available operations
- Worker routing rules
- Input/output schemas

---

### 🗂 Configuration Pipeline

Extension configs are:

1. Mounted via Docker (`docker-compose` / `docker-swarm`)
2. Loaded from file system (`CONFIG_PATH`)
3. Validated at runtime using **Zod**
4. Stored in memory for fast access
5. Used across task validation and routing logic

---

### 📬 RabbitMQ Messaging

The service uses **RabbitMQ (topic exchange model)** for distributed task processing.

Instead of NestJS microservices abstraction, a custom AMQP layer is used for:

- Full control over routing keys
- Precise exchange-topic mapping
- Direct worker service targeting per extension

Libraries used:
- `amqplib`
- `amqp-connection-manager`

---

### 🔁 Task Execution Flow

1. Client creates a task via API
2. Task is validated against extension schema
3. Task is published to RabbitMQ: `tasks.<extension-routing-key>`
4. Worker service consumes the message
5. Worker processes file data (via S3 references)
6. Worker sends result back to Task Service
7. Task Service persists result into MongoDB
8. Notification event is emitted

---

### 📢 Notifications

After task execution (success or failure), the service emits notification events:

- Sent via RabbitMQ
- Consumed by Notification Service
- Used for real-time UI updates

Routing: `tasks.notification`

---

### 🗄 File Integration (MongoDB)

Task Service is aware of the **file collection in MongoDB**, which stores:

- File metadata
- S3 keys
- Processing results references

After task execution:
- Results are linked to file entries
- Output metadata is persisted for further retrieval

---

## 🌍 Internationalization (i18n)

The service supports multilingual responses using:

- `nestjs-i18n`
- `i18next`

Features:
- Localized validation messages
- Localized task metadata descriptions
- Extension-level language support

---

## 📡 API Documentation

Swagger documentation is automatically generated from DTOs and endpoints.

📍 Available at: `/api/task/docs`

Powered by:
- `@nestjs/swagger`

---

## ⚙️ Environment Variables

| Name | Description | Possible Values | Default Value |
|------|-------------|----------------|---------------|
| DB_URI | MongoDB connection string | string | mongodb://root:password@mongodb:27017/statistix?authSource=admin |
| RABBIT_USER | RabbitMQ username | string | user |
| RABBIT_PASSWORD | RabbitMQ password | string | admin_secret |
| CONFIG_PATH | Path to extension config directory | string | ./ |
| LANGUAGE | Default service language | RU / EN | EN |

---

## 🧱 Architecture Overview

### Backend Stack

- **NestJS** (core framework)
- **MongoDB** (task + file metadata storage)
- **RabbitMQ (topic exchange)** (async processing)
- **Zod** (runtime config validation)
- **class-validator + class-transformer** (DTO validation)

---

## 🔄 RabbitMQ Architecture

### Exchange

`tasks-exchange`

### Routing Structure

- Task execution: `tasks.<extension-key>`
- Task results: `tasks.results`
- Task failures: `tasks.failed`
- Notifications: `tasks.notification`

---

### Key Design Decision

Instead of using `@nestjs/microservices`, a **manual AMQP layer** is implemented to:

- Control routing logic per extension
- Avoid abstraction limitations
- Enable fine-grained worker targeting
- Support dynamic extension-based routing

