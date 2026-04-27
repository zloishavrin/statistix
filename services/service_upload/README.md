# STATISTIX | Upload File Service

## Description

The file upload microservice uses a REST API for uploading, validating, and managing user files. It follows the AWS S3 specification for file operations.

## Features

- Direct streaming file upload to S3
- Retrieval of uploaded user files
- File validation – only CSV, XLS, and XLSX files are allowed for upload
- Internationalization (i18n) of error messages

## Environment Variables

| Name | Description | Possible Values | Default Value |
|----------|----------|--------------------|-----------------------|
| DB_URI | Database connection string | String | mongodb://root:password@mongodb:27017/statistix?authSource=admin |
| LANGUAGE | Language | RU, EN | EN |
| S3_URI | S3 connection link | String | http://minio:9000 |
| S3_ACCESS_KEY_ID | S3 access key ID | String | admin |
| S3_SECRET_ACCESS_KEY | S3 secret access key | String | admin_secret |
| S3_REGION | Region name for S3 | String | ru-central-1 |
| S3_BUCKET | Bucket name for S3 | String | statistix |
| FILE_SIZE_LIMIT | Maximum file size limit (in MB) | Number | 500 |

## API Documentation (Swagger)

Documentation is available at: `/api/upload/docs` after starting the service.