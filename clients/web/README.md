# STATISTIX | Web Client

## 📌 Overview

**STATISTIX Web Client** is a frontend application for interacting with the Statistix API platform.

It is designed as a data processing and visualization interface that allows users to upload files, configure transformations, manage tasks, and visualize results in tables or charts.

The project follows the **Feature-Sliced Design (FSD)** architecture with a slightly relaxed internal import rule: shared layer modules may import each other (e.g. `shared/ui/select` → `shared/ui/button`).

---

## 🧠 Architecture

The application is built using:

- **Feature-Sliced Design (FSD)**
- **React ecosystem**
- **Axios-based API layer**
- **TanStack Query (React Query)** for server state
- **Zustand** for global client state
- **TanStack Router** for routing
- **WebSocket** for real-time updates

---

## 🚀 Core Domain

The system is built around four main domain entities:

### 📁 Files

Files are the primary data source (CSV / XLS / XLSX stored in S3).

Two backend services are used:

#### File Management Service
- Upload files
- Fetch file list with metadata
- Download files via S3 streaming proxy

#### File Preview Service
- Generate table previews (reduced datasets)
- Generate chart previews using downsampling algorithms
- Optimized for UI rendering, not full data export

#### UI Layer
- `widget/table-manager`
  - Upload files
  - Select columns and schema

- `widget/data-preview`
  - Display output data
  - Switch between table and chart view
  - Chart customization via Recharts

---

### 🧩 Extensions

Extensions define transformation logic and processing methods.

They provide:
- List of available extensions
- Method metadata
- Input/output schema definitions
- Execution rules for task creation

---

### ⚙️ Tasks

A **Task** represents a computation request.

It contains:
- Input data
- Processing result
- Execution status (`loading | success | error`)
- Error details (if any)

Tasks are the central unit of async processing in the system.

---

### 🔔 Notifications (WebSocket)

Real-time updates are handled via:

`features/notification`

Capabilities:
- WebSocket connection using authenticated token
- Task completion events (success / error)
- UI notifications
- Automatic data refetch via `queryClient.invalidateQueries`

---

## 🔐 Authentication

Implemented in `features/authorization`.

### Features:
- Login / Logout
- Registration
- Password reset
- Fetch current user (`me`)

### JWT Strategy

Two-token system:

#### Refresh Token
- Stored in `localStorage`
- Used to obtain new access tokens

#### Access Token
- Used for all API requests
- Used for WebSocket authentication

### API Layers

#### `shared/api`
- Main Axios instance
- Handles automatic token refresh on `401/403`

#### `authApi`
- Dedicated authentication API instance
- On `401/403` → forces logout (no refresh attempt)

### State Management

- Zustand store handles auth state globally
- Ensures UI synchronization across all layers

### Routing

Powered by `tanstack/react-router`:

- **Public routes**
- **Private routes**

Behavior:
- `PrivateLayout` redirects to public routes on logout
- Public routes do not have access to:
  - Authenticated API instance
  - WebSocket notifications

---

## 🌐 Internationalization

Handled by `features/languages`:

Libraries:
- `i18next`
- `react-i18next`
- `i18next-browser-languagedetector`

State:
- Managed via Zustand store

Translations stored in `shared/i18n`


---

## 🎨 UI System

### Theming

- Controlled via `ThemeProvider`
- Uses CSS variables globally

---

### Icons

- SVG-based React components
- Located in `shared/ui/icons`

Features:
- CSS-based color control
- Hover / active states
- Fully reusable UI primitives

---

### Styling

- CSS Modules (primary styling system)
- Global styles:
  - `index.css`
  - `reset.css`

---

### Animations

- `framer-motion` for UI animations
- Abstraction layer `shared/lib/motion/create-motion-props`

Used to standardize animation variants across components.

---

## 🪟 Modals

Modal system is implemented in `shared/ui/modal`

Architecture:
- Uses React Portal
- Root container:
```
<div id="modals"></div>
```

All modals are rendered outside the main application DOM tree.

---

## Environment Variables

| Name | Description | Possible Values |
|----------|----------|--------------------|
| VITE_API_URL | API base URL | String |
| VITE_DEFAULT_LANGUAGE | Language | RU, EN (EN default) |

---

## 🧱 Tech Stack

- React
- TypeScript
- Vite
- Axios
- TanStack Query
- TanStack Router
- Zustand
- i18next
- Framer Motion
- Recharts
- CSS Modules