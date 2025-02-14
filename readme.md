# STATISTIX

Простое построение статистических моделей.

# BACKEND

Серверная часть платформы написана на Python.

# FRONTEND

Клиентская часть платформы написана на ReactJS.

# NGINX

TODO: Настроить NGINX веб-сервер.

# Запуск платформы

Запуск и разворачивание платформы происходит благодаря Docker-композиции.
Необходимо установить Docker (Docker Desktop).

```bash
docker-compose up --build
```

Перед запуском необходимо создать файл **.env** в корне проекта. Пример содержимого:
```
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=admin
MONGOEXPRESS_LOGIN=admin
MONGOEXPRESS_PASSWORD=admin
```
  
Для установки зависимостей сервеной части нужно установить poetry и написать в директории /model-service
```
poetry config --local && poetry install --no-root
``` 

Обращаться к серверной части можно по **localhost:8000/**.

Клиентская часть в DEV-режиме запускается на **localhost:3000/**.
