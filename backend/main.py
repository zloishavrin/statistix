from fastapi import FastAPI
from routers import arima

app = FastAPI()
app.include_router(arima.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)