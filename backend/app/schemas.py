from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class FarmInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=300)
    phosphorus: float = Field(..., ge=0, le=300)
    potassium: float = Field(..., ge=0, le=300)
    ph: float = Field(..., ge=3, le=10)
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    rainfall: float = Field(..., ge=0, le=2000)
    water_available: float = Field(..., ge=0)
    farm_area: float = Field(..., gt=0)
    previous_crop: Optional[str] = None
    season: str = "kharif"
    soil_type: str = "loamy"
    budget: float = Field(..., ge=0)
    objective: str = "balanced"
    location: str = "India"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    use_realtime_market: bool = False
    use_realtime_weather: bool = False

class CropRecommendation(BaseModel):
    crop: str
    suitability: float
    confidence: float
    water_risk: str
    climate_risk: str
    market_outlook: str
    reasons: List[str]
    risks: List[str]
    factors: dict

class RecommendationResponse(BaseModel):
    recommendations: List[CropRecommendation]
    disclaimer: str
    data_source: Optional[str] = "Real Kaggle Agricultural Dataset (2,200 Indian Field Records)"
    model_accuracy: Optional[str] = "99.1% (Random Forest Classifier)"
    realtime_context: Optional[Dict[str, Any]] = None

class WhatIfRequest(BaseModel):
    farm: FarmInput
    water_change_percent: float = Field(..., ge=-100, le=200)
