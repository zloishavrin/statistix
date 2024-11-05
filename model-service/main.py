from fastapi import FastAPI
from routers import TimeSeriesModels
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

#router -> controller -> services

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

app.include_router(TimeSeriesModels.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
    