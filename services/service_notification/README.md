# STATISTIX | Notification Service

![Framework](https://img.shields.io/badge/framework-NestJS-red)
![Realtime](https://img.shields.io/badge/realtime-WebSockets-blue)
![Messaging](https://img.shields.io/badge/messaging-RabbitMQ-orange)

---

## 📌 Description

**STATISTIX Notification Service** is a real-time communication layer responsible for delivering **task execution updates** to clients.

It acts as a bridge between:

- RabbitMQ task result events
- WebSocket client connections (Socket.IO)
- Authenticated user sessions (JWT-based)

The service does **not use any database** and operates purely as a real-time event gateway.

---

## 🚀 Features

### 📡 Real-time Notifications

The service listens to RabbitMQ task result events and instantly pushes updates to connected clients.

It handles:

- Task completion events
- Task failure events
- Status updates propagation

All notifications are delivered in real-time via WebSocket.

---

### 🐇 RabbitMQ Listener

The service consumes messages from the **Task Service event pipeline**.

### Routing keys:

- Task execution: `tasks.*`
- Notification events: `tasks.notification`

The service subscribes specifically to notification-related events emitted after task execution.

---

### 🔁 Event Flow

1. Task Service processes a task
2. Worker completes execution
3. Task Service emits notification event: `tasks.notification`
4. Notification Service consumes message
5. Message is pushed to WebSocket client by userId room

---

### 🔐 Authentication (JWT)

WebSocket connections are authenticated using **JWT access tokens**.

Flow:

- Client sends token via `socket.handshake.auth`
- Token is verified using `JwtService`
- On success → user is assigned to a socket room (`userId`)
- On failure → connection is rejected or ignored

---

### 🌐 WebSocket Gateway

Built using:

- `@nestjs/websockets`
- `socket.io`

---

### 📡 Connection Flow

When a client connects:

1. Token is extracted from handshake
2. JWT validation is performed:
- If valid → extract sub (userId)
- If invalid → connection is ignored
3. Client joins a room

This enables user-scoped event delivery.

---

### 📢 Notification Delivery

When a RabbitMQ message is received the service emits a WebSocket event.

---

### 🌍 Internationalization (i18n)

The service supports multilingual behavior via:

- nestjs-i18n
- i18next

Usage:

- Shared translation structure with other STATISTIX services

---

## ⚙️ Environment Variables

| Name | Description | Possible Values | Default Value |
|------|-------------|----------------|---------------|
| JWT_SECRET_ACCESS | Secret key for JWT verification | string | jwt-access |
| RABBIT_USER | RabbitMQ username | string | user |
| RABBIT_PASSWORD | RabbitMQ password | string | admin_secret |
| LANGUAGE | Default service language | RU / EN | EN |

---

## 🧱 Architecture Overview

### Backend Stack

- **NestJS** (core framework)
- **Socket IO**
- **RabbitMQ (topic exchange)** (amqplib / connection manager)
- **JWT** (authentication layer)
- **i18n** (nestjs-i18n + i18next)


