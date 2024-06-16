from fastapi import APIRouter
from controllers.linear_reg import get_example_controller

router = APIRouter()

@router.get("/hello")
def get_item():
    return get_example_controller()