import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.recommendation import recommend, MODEL, DATASET_INFO, CROPS
from app.schemas import FarmInput

client = TestClient(app)

def test_model_trained_on_real_dataset():
    """Verify the model is trained on real dataset and has learned multiple crops."""
    assert "Real Kaggle Agricultural Dataset" in DATASET_INFO
    assert len(MODEL.classes_) >= 22
    assert "Rice" in MODEL.classes_
    assert "Cotton" in MODEL.classes_
    assert "Chickpea" in MODEL.classes_

def test_recommendation_service_outputs():
    """Verify recommendation logic runs cleanly on real model."""
    farm = FarmInput(
        nitrogen=80,
        phosphorus=45,
        potassium=40,
        ph=6.5,
        temperature=25,
        humidity=80,
        rainfall=200,
        water_available=1500,
        farm_area=1.0,
        previous_crop="cotton",
        season="kharif",
        budget=50000,
        objective="income",
        location="Warangal"
    )
    results = recommend(farm)
    assert len(results) == 3
    for r in results:
        assert "crop" in r
        assert "suitability" in r
        assert "factors" in r
        assert r["factors"]["ML signal"] >= 0

def test_recommend_api_endpoint():
    """Test the POST /api/recommend endpoint with real dataset metadata."""
    payload = {
        "nitrogen": 80,
        "phosphorus": 45,
        "potassium": 40,
        "ph": 6.5,
        "temperature": 25,
        "humidity": 80,
        "rainfall": 200,
        "water_available": 1500,
        "farm_area": 1.0,
        "previous_crop": "cotton",
        "season": "kharif",
        "soil_type": "black",
        "budget": 50000,
        "objective": "income",
        "location": "Warangal"
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) == 3
    assert "Real Kaggle Agricultural Dataset" in data["data_source"]
    assert "model_accuracy" in data

def test_realtime_market_prices_endpoint():
    """Test the GET /api/realtime/market-prices endpoint."""
    res = client.get("/api/realtime/market-prices?state=Telangana")
    assert res.status_code == 200
    data = res.json()
    assert "crops" in data
    assert "Rice" in data["crops"]
    assert "modal_price_qtl" in data["crops"]["Rice"]

def test_realtime_environment_endpoint():
    """Test the GET /api/realtime/environment endpoint."""
    res = client.get("/api/realtime/environment?lat=17.385&lon=78.4867")
    assert res.status_code == 200
    data = res.json()
    assert "temperature" in data
    assert "humidity" in data
    assert "soil_moisture" in data
