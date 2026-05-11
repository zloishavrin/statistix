FROM python:3.12-slim

WORKDIR /time-series

ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/time-series/src

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "src/main.py"]