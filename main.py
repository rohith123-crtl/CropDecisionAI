from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

base_dir = Path(__file__).resolve().parent
model_path = base_dir / "crop_model.pkl"
if not model_path.exists():
    legacy_path = base_dir / "Crop_recommendation.pkl"
    if legacy_path.exists():
        model_path = legacy_path
    else:
        raise FileNotFoundError(
            "No trained model found. Run train.py first or make sure crop_model.pkl exists."
        )

app = FastAPI(title="Crop Recommendation API")
model = joblib.load(model_path)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    ph: float
    temperature: float
    humidity: float
    rainfall: float


@app.get("/")
def health_check():
    return {"message": "Crop Recommendation API is running"}


@app.post("/predict")
def predict_crop(data: CropInput):
    features = np.array(
        [[data.N, data.P, data.K, data.ph, data.temperature, data.humidity, data.rainfall]]
    )
    prediction = model.predict(features)
    return {"recommended_crop": prediction[0]}