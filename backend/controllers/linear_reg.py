from fastapi import HTTPException
from services.linear_reg import get_example_data

def get_example_controller():
    data = get_example_data()
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    return data