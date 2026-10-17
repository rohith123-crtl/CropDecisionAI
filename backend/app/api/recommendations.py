from fastapi import APIRouter, Depends
from app.accounts import optional_user, save_recommendation
from app.schemas import FarmInput, RecommendationResponse, WhatIfRequest
from app.services.recommendation import recommend

router = APIRouter(tags=["recommendations"])

@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(farm: FarmInput, user=Depends(optional_user)):
    result = {
        "recommendations": recommend(farm),
        "disclaimer": "Demo decision-support output. Replace the demo model and market factors with validated regional data before real-world agricultural use."
    }
    if user:
        save_recommendation(user["id"], farm.model_dump(), result)
    return result

@router.post("/what-if", response_model=RecommendationResponse)
def what_if(req: WhatIfRequest):
    updated = req.farm.model_copy()
    updated.water_available = max(0, updated.water_available * (1 + req.water_change_percent/100))
    return {
        "recommendations": recommend(updated),
        "disclaimer": "What-if analysis is a scenario estimate, not a guaranteed farm outcome."
    }
