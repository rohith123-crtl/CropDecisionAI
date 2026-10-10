from fastapi import APIRouter
from app.services.recommendation import CROPS

router = APIRouter(tags=["crops"])

@router.get("/crops")
def crops():
    return {"crops": sorted(CROPS.keys())}
