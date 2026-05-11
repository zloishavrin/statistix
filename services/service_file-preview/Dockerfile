# BASE
FROM python:3.12-slim AS base

WORKDIR /file-preview

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1


# DEPENDENCIES
FROM base AS deps

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir "uvicorn[standard]" "gunicorn"


# RUNTIME
FROM base AS runtime

WORKDIR /file-preview

COPY --from=deps /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=deps /usr/local/bin /usr/local/bin

COPY . .

ENV PYTHONPATH=/file-preview/src

EXPOSE 8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "src.main:app", \
     "--bind", "0.0.0.0:8000"]