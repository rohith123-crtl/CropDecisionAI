import numpy as np
from sklearn.ensemble import RandomForestClassifier

CROPS = {
    "Rice": {
        "n": 90, "p": 45, "k": 45, "ph": 6.2, "temp": 27, "humidity": 80,
        "rain": 180, "water": 1600, "seasons": ["kharif"],
        "rotation": ["legumes", "groundnut", "maize"], "market": 0.65
    },
    "Maize": {
        "n": 80, "p": 40, "k": 35, "ph": 6.3, "temp": 25, "humidity": 65,
        "rain": 100, "water": 700, "seasons": ["kharif", "rabi"],
        "rotation": ["rice", "groundnut", "pulses"], "market": 0.72
    },
    "Groundnut": {
        "n": 35, "p": 30, "k": 35, "ph": 6.3, "temp": 27, "humidity": 60,
        "rain": 80, "water": 500, "seasons": ["kharif", "rabi"],
        "rotation": ["rice", "maize", "cotton"], "market": 0.74
    },
    "Cotton": {
        "n": 75, "p": 35, "k": 45, "ph": 6.5, "temp": 27, "humidity": 60,
        "rain": 100, "water": 800, "seasons": ["kharif"],
        "rotation": ["rice", "maize", "groundnut"], "market": 0.70
    },
    "Chickpea": {
        "n": 35, "p": 35, "k": 30, "ph": 6.8, "temp": 20, "humidity": 50,
        "rain": 55, "water": 350, "seasons": ["rabi"],
        "rotation": ["rice", "maize", "cotton"], "market": 0.76
    },
    "Soybean": {
        "n": 55, "p": 35, "k": 35, "ph": 6.4, "temp": 25, "humidity": 65,
        "rain": 100, "water": 650, "seasons": ["kharif"],
        "rotation": ["wheat", "maize", "rice"], "market": 0.71
    },
    "Millet": {
        "n": 30, "p": 25, "k": 25, "ph": 6.5, "temp": 28, "humidity": 45,
        "rain": 55, "water": 300, "seasons": ["kharif", "rabi"],
        "rotation": ["rice", "cotton"], "market": 0.73
    },
}

FEATURES = ["nitrogen","phosphorus","potassium","ph","temperature","humidity","rainfall"]

def _make_demo_model():
    rng = np.random.default_rng(42)
    X, y = [], []
    for crop, p in CROPS.items():
        for _ in range(180):
            vals = [
                rng.normal(p["n"], 18),
                rng.normal(p["p"], 10),
                rng.normal(p["k"], 12),
                rng.normal(p["ph"], .35),
                rng.normal(p["temp"], 4),
                rng.normal(p["humidity"], 12),
                rng.normal(p["rain"], 45),
            ]
            X.append(vals)
            y.append(crop)
    model = RandomForestClassifier(n_estimators=160, random_state=42)
    model.fit(np.array(X), y)
    return model

MODEL = _make_demo_model()

def _closeness(value, target, tolerance):
    return float(np.exp(-((value-target)/max(tolerance, 1e-6))**2))

def _water_factor(available, required, area):
    needed = required * area
    ratio = available / max(needed, 1)
    return min(1.0, ratio), needed

def _risk_label(r):
    if r >= .8: return "Low"
    if r >= .55: return "Medium"
    return "High"

def _market_label(v):
    if v >= .78: return "Strong"
    if v >= .68: return "Good"
    if v >= .55: return "Moderate"
    return "Weak"

def recommend(farm):
    x = np.array([[farm.nitrogen, farm.phosphorus, farm.potassium,
                   farm.ph, farm.temperature, farm.humidity, farm.rainfall]])
    probs = MODEL.predict_proba(x)[0]
    model_probs = dict(zip(MODEL.classes_, probs))
    results = []

    for crop, p in CROPS.items():
        soil = np.mean([
            _closeness(farm.nitrogen, p["n"], 45),
            _closeness(farm.phosphorus, p["p"], 25),
            _closeness(farm.potassium, p["k"], 25),
            _closeness(farm.ph, p["ph"], .8),
        ])
        climate = np.mean([
            _closeness(farm.temperature, p["temp"], 8),
            _closeness(farm.humidity, p["humidity"], 25),
            _closeness(farm.rainfall, p["rain"], 100),
        ])
        water_ratio, needed = _water_factor(farm.water_available, p["water"], farm.farm_area)
        water_score = min(1, water_ratio)
        season_score = 1.0 if farm.season.lower() in p["seasons"] else .45
        rotation_score = 1.0
        prev = (farm.previous_crop or "").lower()
        if prev and prev == crop.lower():
            rotation_score = .55
        elif prev and prev in [x.lower() for x in p["rotation"]]:
            rotation_score = 1.0

        ml = model_probs.get(crop, 0.0)
        market = p["market"]

        if farm.objective == "water_saving":
            score = .30*soil + .18*climate + .12*ml + .22*water_score + .08*season_score + .05*rotation_score + .05*market
        elif farm.objective == "income":
            score = .25*soil + .15*climate + .12*ml + .10*water_score + .08*season_score + .10*rotation_score + .20*market
        elif farm.objective == "low_risk":
            score = .28*soil + .20*climate + .10*ml + .18*water_score + .10*season_score + .09*rotation_score + .05*market
        else:
            score = .28*soil + .20*climate + .12*ml + .14*water_score + .10*season_score + .08*rotation_score + .08*market

        reasons, risks = [], []
        if soil >= .72: reasons.append("Soil nutrient and pH profile is compatible.")
        if climate >= .72: reasons.append("Current temperature, humidity and rainfall are favorable.")
        if water_score >= .8: reasons.append("Available water covers most of the estimated crop requirement.")
        else: risks.append("Available water may be insufficient for the estimated requirement.")
        if season_score >= .9: reasons.append(f"{farm.season.title()} is a suitable season for this crop.")
        else: risks.append("The selected season is less suitable for this crop.")
        if rotation_score < 1: risks.append("Growing the same crop repeatedly can reduce rotation compatibility.")
        if market >= .72: reasons.append("The demo market outlook factor is favorable.")

        climate_risk = _risk_label(climate)
        water_risk = _risk_label(water_score)
        confidence = min(.98, max(.45, .55 + .35*ml + .10*soil))
        factors = {
            "Soil": round(soil*100, 1),
            "Climate": round(climate*100, 1),
            "Water": round(water_score*100, 1),
            "Season": round(season_score*100, 1),
            "Rotation": round(rotation_score*100, 1),
            "Market": round(market*100, 1),
            "ML signal": round(ml*100, 1),
        }

        results.append({
            "crop": crop,
            "suitability": round(score*100, 1),
            "confidence": round(confidence*100, 1),
            "water_risk": water_risk,
            "climate_risk": climate_risk,
            "market_outlook": _market_label(market),
            "reasons": reasons[:4],
            "risks": risks[:3],
            "factors": factors,
            "_score": score
        })

    results.sort(key=lambda r: r["_score"], reverse=True)
    for r in results: r.pop("_score", None)
    return results[:3]
