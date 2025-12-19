# STATISTIX | Authentification Service

## Description

The authentication microservice provides a REST API for user management, including registration, login, token validation, and session management. The service is built on NestJS and uses JWT for authentication.

## Features

- User registration with data encryption
- Authentication via login/password with JWT token issuance
- JWT tokens (Access and Refresh) with separate secrets and lifetimes
- Logout from all devices (deletion of all sessions)
- Token validation with user verification in the database
- Internationalization (i18n) of error messages
- Secure storage of logins and passwords

## Environment Variables

| Name | Description | Possible Values | Default Value |
|----------|----------|--------------------|-----------------------|
| DB_URI | Database connection string | String | mongodb://root:password@mongodb:27017/statistix?authSource=admin |
| LANGUAGE | Language | RU, EN | EN |
| ENCRYPT_SECRET | Encryption key | String | encrypt-secret |
| HASH_SECRET | Hashing key | String | hash-secret |
| JWT_EXPIRES_REFRESH | Refresh token lifetime | ms.StringValue | 30d |
| JWT_SECRET_REFRESH | Refresh token secret | String | jwt-refresh |
| JWT_EXPIRES_ACCESS | Access token lifetime | ms.StringValue | 15m |
| JWT_SECRET_ACCESS | Access token secret | String | jwt-access |
| REGISTRATION_ENABLED | Status - whether registration is enabled | true, false | false |

## API Documentation (Swagger)

Documentation is available at: `/api/auth/docs` after starting the service.