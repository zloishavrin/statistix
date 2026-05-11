# Fast Setup

## Local deployment

Local deployment can be used both for working with STATISTIX on your machine and for developing custom extensions (workers).

Before starting, create and configure environment variables. The easiest way is to copy .env.example:

```bash
cp .env.example .env
```

Then fill in the required values.

After that, start the full local stack:

```bash
docker compose up --build
```

This command will build and launch:
- NestJS backend services
- API Gateway
- Frontend
- RabbitMQ
- MongoDB
- MinIO (S3-compatible storage)
- All connected workers/extensions

---

### Docker Compose Development Integration

For local development, workers and their configs should also be connected inside docker-compose.yml.

Example:

```yaml
service-task:
  build:
    context: ./services/service_task
    dockerfile: Dockerfile.dev

  depends_on:
    - minio
    - mongodb
    - rabbitmq

  volumes:
    - ./services/service_task:/usr/src/task
    - /usr/src/task/node_modules

    - ./workers/worker_statistics/statistics.worker-config.json:/usr/src/task/statistics.worker-config.json
    - ./workers/worker_time-series/time-series.worker-config.json:/usr/src/task/time-series.worker-config.json
    - ./workers/worker_data-processing/data-processing.worker-config.json:/usr/src/task/data-processing.worker-config.json

  env_file:
    - ./.env

  command: npm run start:dev
```

Worker services are connected independently:

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

  command: watchmedo auto-restart \
    --patterns=*.py \
    --recursive \
    --directory=src \
    python src/main.py
```

The same pattern is used for all additional workers.

This architecture allows:
- hot-reload during worker development
- isolated worker deployment
- dynamic extension registration
- independent scaling of computational services

---

## Production Deployment

For production environments, it is recommended to use Docker Swarm deployment.

Initialize Docker Swarm first:

```bash
docker swarm init
```

---

### Environment Variables

Production deployment requires environment variables.

You can define them either in `.env` or directly in the shell before deployment.

Example:

```env
RABBIT_USER=user
RABBIT_PASSWORD=admin_secret

DB_NAME=statistix

S3_ACCESS_KEY_ID=admin
S3_SECRET_ACCESS_KEY=admin_secret
```

Important settings:

```env
GATEWAY_ALLOW_ORIGINS="https://demo.statistix.ru"
GATEWAY_DOMAIN="demo.statistix.ru"
```

These variables configure:
- CORS policy
- API Gateway domain
- Frontend communication endpoints

---

### File Upload Limits

Maximum user upload size:

```env
FILE_SIZE_LIMIT="500"
```

Value is specified in megabytes.

---

### Docker Secrets Support

All STATISTIX services support reading environment variables from files.

This is especially useful for Docker Swarm Secrets.

Create secrets:

```bash
echo "root" | docker secret create mongo_root_username -
echo "password" | docker secret create mongo_root_password -

echo "mongodb://root:password@mongodb:27017/statistix?authSource=admin" | docker secret create db_uri -

echo "encrypt-secret" | docker secret create encrypt_secret -
echo "hash-secret" | docker secret create hash_secret -

echo "jwt-refresh" | docker secret create jwt_secret_refresh -
echo "jwt-access" | docker secret create jwt_secret_access -
```

To use Docker Secrets, define variables in `<ENV_NAME>_FILE` format inside `docker-compose.prod.yml`.

Example:

```env
environment:
  DB_URI_FILE: /run/secrets/db_uri
```

The _FILE postfix tells STATISTIX services to read values directly from mounted files.

---

### Build Core STATISTIX Services

Build backend services:

```bash
docker build -t statistix-task ./services/service_task

docker build -t statistix-auth ./services/service_authentification

docker build -t statistix-file ./services/service_file-managment

docker build -t statistix-preview ./services/service_file-preview

docker build -t statistix-notification ./services/service_notification
```

---

### API Gateway Configuration

Create Docker Config for the API Gateway:

```bash
docker config create caddy-config infrastructure-services/caddy/Caddyfile
```

Then build the Gateway image.

Gateway build also compiles the frontend application.

Required build arguments:

- `VITE_API_URL` — backend API URL
- `VITE_DEFAULT_LANGUAGE` — default frontend language

Example:

```bash
docker build \
  --build-arg VITE_API_URL="https://demo.statistix.ru" \
  --build-arg VITE_DEFAULT_LANGUAGE="EN" \
  -t statistix-gateway:latest \
  -f infrastructure-services/caddy/Dockerfile .
```

---

### Build Extensions (Workers)

Workers are independent extension services connected through RabbitMQ.

Build default workers:

```bash
docker build -t statistix-worker-statistics ./workers/worker_statistics

docker build -t statistix-worker-time-series ./workers/worker_time-series

docker build -t statistix-worker-data-processing ./workers/worker_data-processing
```

---

### Register Worker Configurations

Each extension must provide a worker configuration JSON.

These configs are used by STATISTIX Task Service to dynamically register available methods, inputs, outputs, and metadata.

Create Docker Config objects:

```bash
docker config create statistics_config \
  ./workers/worker_statistics/statistics.worker-config.json

docker config create time_series_config \
  ./workers/worker_time-series/time-series.worker-config.json

docker config create data_processing_config \
  ./workers/worker_data-processing/data-processing.worker-config.json
```

---

### Add Worker Configs to Docker Swarm

When adding third-party extensions or your own workers, their configs must also be registered in `docker-compose.prod.yml`.

Example:

```yaml
configs:
  caddy-config:
    external: true

  statistics_config:
    external: true

  time_series_config:
    external: true

  data_processing_config:
    external: true
```

Then mount these configs into service-task:

```yaml
service-task:
  ...
  configs:
    - source: statistics_config
      target: /task/statistics.worker-config.json

    - source: time_series_config
      target: /task/time-series.worker-config.json

    - source: data_processing_config
      target: /task/data-processing.worker-config.json
```

Without mounted configs, STATISTIX will not detect and register worker methods.

---

### Deploy Docker Swarm Stack

After all configuration is completed:

```bash
export $(grep -v '^#' .env | xargs) && \
docker stack deploy -c docker-compose.prod.yml statistix
```

### Verify Deployment

Check running services:

```bash
docker service ls
```

## Custom S3 Storage

STATISTIX supports any AWS S3-compatible object storage.

By default, the platform uses self-hosted MinIO.

To connect your own storage provider:

```env
S3_URI="http://minio:9000"
S3_ACCESS_KEY_ID="admin"
S3_SECRET_ACCESS_KEY="admin_secret"
S3_REGION="ru-central-1"
```

You may use:
- AWS S3
- MinIO
- Yandex Object Storage
- Cloudflare R2
- Wasabi
- Any compatible S3 provider

## Custom MongoDB and RabbitMQ

External infrastructure services are also supported.

MongoDB example:

```env
DB_URI="mongodb://admin:admin@mongodb:27017/statistix?authSource=admin"

DB_NAME="statistix"

MONGO_ROOT_USER="admin"
MONGO_ROOT_PASSWORD="admin"
```

RabbitMQ example:

```env
RABBIT_USER=user
RABBIT_PASSWORD=admin_secret
```

This allows deploying STATISTIX into existing enterprise infrastructure environments without requiring bundled databases or message brokers.