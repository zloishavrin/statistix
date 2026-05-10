# STATISTIX | File Preview Service

![Framework](https://img.shields.io/badge/framework-FastAPI-blue)
![Storage](https://img.shields.io/badge/storage-S3%20(MinIO)%20%7C%20AWS-orange)
![Database](https://img.shields.io/badge/database-MongoDB-green)

---

## 📌 Description

**STATISTIX File Preview Service** is a backend service responsible for generating **lightweight previews of user-uploaded files** (CSV, XLS, XLSX).

It provides optimized representations of:

- Table previews (limited rows)
- Chart previews (downsampled numeric data)

The service is built with **FastAPI** and integrates with:

- MongoDB (file metadata storage)
- S3-compatible storage (MinIO / AWS S3)
- Pandas (data processing engine)

It is designed purely for **data visualization preparation**, not full file processing or transformations.

---

## 🚀 Features

### 📁 File Preview Generation

The service exposes two main preview modes:

#### 📊 Chart Preview

- Extracts numeric columns from files
- Converts values using `pandas`
- Applies **LTTB (Largest-Triangle-Three-Buckets)** downsampling
- Limits chart data to 1000 points per column
- Optimized for frontend visualization performance

---

#### 📋 Table Preview

- Extracts tabular data from files
- Limits output to 10 rows per column
- Appends `"..."` to indicate truncation
- Designed for quick UI inspection

---

### 🧠 Supported File Types

- `.csv`
- `.xls`
- `.xlsx`

Unsupported formats are rejected with localized error messages.

---

### 🗄 Data Source Flow

1. File metadata is retrieved from **MongoDB**
2. File is validated (ownership + type check)
3. File is downloaded from **S3 storage**
4. Data is parsed using `pandas`
5. Preview is generated and returned

---

### ☁️ Storage Layer (S3 / MinIO)

The service integrates with S3-compatible storage via `boto3`.

Capabilities:
- File retrieval by key
- Retry-based connection logic
- Region-aware configuration
- Supports AWS S3 and MinIO

---

### 🌍 Internationalization (i18n)

The service supports localization via middleware.

Mechanism:
- Reads `Accept-Language` header
- Falls back to default language if unsupported
- Stores resolved locale in `request.state`

Supported languages:
- `ru`
- `en`

All error messages are localized using a translation layer (`t(locale, key)`).

---

### 🌐 API Layer

Built using **FastAPI router structure**.

Endpoints:

- `GET /api/file-preview/chart/{file_id}`
- `GET /api/file-preview/table/{file_id}`

Both endpoints:
- Require authenticated user context
- Validate file ownership
- Return structured preview DTOs

---

## ⚙️ Architecture Overview

### Core Components

- **FastAPI application**
- **MongoDB (ODM: ODMantic)**
- **S3 Storage (boto3 client)**
- **Pandas data processing layer**
- **Language middleware**
- **Preview service layer**

---

### 🧩 Service Structure

#### PreviewService

Responsible for:
- Loading file metadata from MongoDB
- Fetching file from S3
- Parsing file into DataFrame
- Generating:
  - Table preview DTO
  - Chart preview DTO

Includes:
- Column mapping
- Type conversion (numeric parsing)
- Data truncation logic
- Downsampling for large datasets

---

#### StorageService

Handles:
- S3 connection lifecycle
- File retrieval by key
- Retry-based initialization
- Connection validation

Behavior:
- Automatically reconnects on failure
- Supports configurable retry strategy
- Stateless after initialization

---

#### LanguageMiddleware

Responsible for:
- Extracting language from request headers
- Normalizing locale format
- Enforcing supported languages
- Attaching locale to request context
- Setting response `Content-Language` header

---

## 🗄 Database Layer (MongoDB)

The service uses **ODMantic (AIOEngine)** for MongoDB access.

Responsibilities:
- File metadata storage
- File ownership validation
- File lookup by ID

Validation rules:
- File must exist
- File must belong to requesting user
- File type must be supported

---

## 📊 Data Processing Logic

### Chart Preview

Pipeline:
1. Read DataFrame
2. Convert columns to numeric
3. Apply LTTB downsampling (if > 1000 points)
4. Return structured chart dataset

Optimization goal:
- Reduce frontend rendering load
- Preserve visual shape of data distribution

---

### Table Preview

Pipeline:
1. Read DataFrame
2. Extract column values
3. Limit to 10 rows per column
4. Append truncation indicator `"..."`

Optimization goal:
- Fast UI preview
- Minimal payload size

---

## ⚙️ Configuration

### Environment Variables

| Name | Description | Default |
|------|-------------|---------|
| DB_URI | MongoDB connection string | mongodb://root:password@mongodb:27017/statistix?authSource=admin |
| DB_NAME | Database name | statistix |
| S3_URI | S3 endpoint URL | http://minio:9000 |
| S3_ACCESS_KEY_ID | S3 access key | admin |
| S3_SECRET_ACCESS_KEY | S3 secret key | admin_secret |
| S3_BUCKET | S3 bucket name | statistix |
| S3_REGION | S3 region | ru-central-1 |
| LANGUAGE | Default language | EN |

---

## 🧱 Dependencies

Core stack:

- FastAPI
- Uvicorn
- Pandas
- Boto3
- ODMantic
- Motor
- PyMongo
- Pydantic
- Python-dotenv
- LTTB (downsampling)
- OpenPyXL / xlrd (Excel parsing)

---

## 🔁 Request Lifecycle

1. Client requests preview endpoint
2. Middleware resolves language
3. MongoDB validates file ownership
4. File fetched from S3
5. Data parsed into DataFrame
6. Preview generated (table or chart)
7. Response returned as DTO