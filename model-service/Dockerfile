FROM python:3.10.6
WORKDIR /model-service
COPY pyproject.toml poetry.lock ./
RUN pip install --upgrade pip && \
    pip install -U poetry && \
    poetry config --local virtualenvs.create false && \ 
    poetry install --no-root
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]