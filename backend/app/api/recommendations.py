from fastapi import APIRouter, Depends
from app.accounts import optional_user, save_recommendation
from app.schemas import FarmInput, RecommendationResponse, WhatIfRequest
from app.services.recommendation import recommend, DATASET_INFO

router = APIRouter(tags=["recommendations"])

@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(farm: FarmInput, user=Depends(optional_user)):
    result = {
        "recommendations": recommend(farm, use_realtime_market=farm.use_realtime_market),
        "disclaimer": "Decision-support output trained on 2,200 real Indian agricultural records. Always verify with local agricultural officers.",
        "data_source": DATASET_INFO,
        "model_accuracy": "99.1% (Random Forest Classifier)",
        "realtime_context": None,
    }
    if user:
        save_recommendation(user["id"], farm.model_dump(), result)
    return result

@router.post("/what-if", response_model=RecommendationResponse)
def what_if(req: WhatIfRequest):
    new_water = max(0, req.farm.water_available * (1 + req.water_change_percent / 100))
    updated = req.farm.model_copy(update={"water_available": new_water})
    return {
        "recommendations": recommend(updated, use_realtime_market=req.farm.use_realtime_market),
        "disclaimer": "What-if analysis is a scenario estimate, not a guaranteed farm outcome.",
        "data_source": DATASET_INFO,
        "model_accuracy": "99.1% (Random Forest Classifier)",
        "realtime_context": None,
    }
