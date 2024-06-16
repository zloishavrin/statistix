from fastapi import FastAPI
from routers.linear_reg import router as linear_reg_router

app = FastAPI()
app.include_router(linear_reg_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)