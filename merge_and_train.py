"""
merge_and_train.py
Merges the original Crop_recommendation.csv with new Indian crops
derived from crop_yield.csv, then retrains the RandomForest model.
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder

np.random.seed(42)

# ── 1. Load original dataset ─────────────────────────────────────────────────
df_orig = pd.read_csv("Crop_recommendation.csv")
df_orig.columns = df_orig.columns.str.strip().str.lower()
# Standardise label column name
if "label" in df_orig.columns:
    df_orig = df_orig.rename(columns={"label": "crop"})

print(f"Original dataset: {df_orig.shape[0]} rows, crops: {sorted(df_orig['crop'].unique())}")

# ── 2. Load yield dataset to get rainfall ranges per crop ─────────────────────
df_yield = pd.read_csv("crop_yield.csv")
df_yield["Crop"] = df_yield["Crop"].str.strip().str.lower()

rainfall_by_crop = (
    df_yield.groupby("Crop")["Annual_Rainfall"]
    .agg(["mean", "std", "min", "max"])
    .rename(columns={"mean": "rf_mean", "std": "rf_std", "min": "rf_min", "max": "rf_max"})
)

# ── 3. Define agronomic profiles for new Indian crops ─────────────────────────
# Ranges based on ICAR / FAO / Krishi Vigyan Kendra guidelines
# Format: (N_min,N_max), (P_min,P_max), (K_min,K_max),
#         (temp_min,temp_max), (hum_min,hum_max), (ph_min,ph_max), (rain_min,rain_max)
NEW_CROP_PROFILES = {
    "wheat":        ((80,140),(40,80),(40,80),(10,25),(40,70),(6.0,7.5),(50,100)),
    "sugarcane":    ((100,150),(50,100),(80,120),(20,35),(50,85),(6.0,7.5),(1500,2500)),
    "bajra":        ((40,80),(20,40),(20,40),(25,38),(30,60),(6.0,7.5),(300,600)),
    "jowar":        ((50,90),(25,50),(20,40),(26,38),(25,55),(5.5,7.5),(400,600)),
    "groundnut":    ((15,30),(40,60),(20,50),(25,35),(45,75),(5.5,7.0),(500,1200)),
    "soyabean":     ((20,40),(60,80),(20,40),(20,30),(50,80),(6.0,7.0),(600,1000)),
    "sunflower":    ((60,90),(30,60),(30,50),(20,35),(40,70),(6.0,7.5),(700,1200)),
    "rapeseed":     ((80,120),(40,60),(30,50),(10,25),(40,65),(6.0,7.5),(300,450)),
    "onion":        ((80,120),(40,60),(60,80),(13,35),(50,75),(6.0,7.0),(700,1200)),
    "potato":       ((80,120),(40,80),(80,120),(10,25),(60,80),(5.0,6.5),(700,1200)),
    "turmeric":     ((60,80),(40,60),(80,120),(20,35),(70,90),(5.5,7.0),(1500,2500)),
    "ginger":       ((50,80),(40,60),(80,120),(19,28),(70,90),(5.5,6.5),(1500,2500)),
    "ragi":         ((25,50),(20,40),(15,30),(20,33),(30,70),(5.5,7.5),(500,900)),
    "arhar":        ((10,25),(40,60),(20,40),(26,35),(40,70),(6.0,7.5),(600,1000)),
    "urad":         ((10,20),(40,60),(20,40),(25,35),(55,75),(6.0,7.5),(600,1000)),
    "moong":        ((15,25),(40,60),(20,40),(25,35),(50,75),(6.0,7.5),(600,1000)),
    "gram":         ((20,40),(50,80),(20,50),(15,25),(30,60),(5.5,7.0),(300,500)),
    "barley":       ((60,120),(30,60),(30,60),(7,23),(40,65),(6.0,7.5),(400,800)),
    "cotton":       ((100,140),(40,70),(20,50),(21,37),(50,80),(5.5,8.0),(700,1200)),
    "tobacco":      ((60,100),(30,60),(60,100),(20,30),(50,75),(5.5,7.5),(600,1200)),
    "tapioca":      ((80,120),(40,60),(100,140),(20,35),(60,90),(5.5,7.0),(1000,2000)),
    "coconut":      ((40,70),(10,30),(200,300),(20,35),(70,90),(5.2,7.0),(1000,2500)),
    "garlic":       ((100,150),(50,80),(80,120),(12,24),(50,70),(5.5,7.0),(600,1000)),
    "coriander":    ((40,80),(30,60),(30,60),(15,30),(40,70),(6.0,7.5),(300,500)),
    "sesamum":      ((30,60),(25,50),(15,35),(25,38),(40,70),(5.5,7.0),(400,700)),
    "safflower":    ((20,40),(20,40),(20,40),(20,35),(25,60),(6.0,8.0),(300,600)),
    "linseed":      ((40,60),(30,50),(20,40),(15,25),(40,60),(5.5,7.0),(350,500)),
    "cardamom":     ((20,40),(20,40),(30,60),(10,25),(70,90),(5.0,6.5),(1500,3000)),
    "black pepper": ((30,50),(20,40),(40,60),(20,30),(70,90),(5.0,6.5),(1500,3000)),
    "banana":       ((100,140),(50,80),(200,300),(20,35),(75,90),(5.5,7.5),(900,2500)),
    "arecanut":     ((20,50),(15,30),(100,150),(14,36),(70,90),(5.5,7.5),(750,4500)),
    "cashewnut":    ((30,60),(15,35),(50,80),(24,35),(60,80),(5.0,6.5),(600,4500)),
    "sweet potato": ((40,80),(40,60),(80,120),(21,30),(60,80),(5.5,6.5),(750,1500)),
}

N_SAMPLES = 100  # samples per new crop (same as original)

rows = []
for crop_name, profile in NEW_CROP_PROFILES.items():
    (n0,n1),(p0,p1),(k0,k1),(t0,t1),(h0,h1),(ph0,ph1),(r0,r1) = profile
    for _ in range(N_SAMPLES):
        rows.append({
            "n":           np.random.uniform(n0, n1),
            "p":           np.random.uniform(p0, p1),
            "k":           np.random.uniform(k0, k1),
            "temperature": round(np.random.uniform(t0, t1) + np.random.normal(0, 0.5), 4),
            "humidity":    round(np.random.uniform(h0, h1) + np.random.normal(0, 1), 4),
            "ph":          round(np.random.uniform(ph0, ph1) + np.random.normal(0, 0.05), 4),
            "rainfall":    round(np.random.uniform(r0, r1) + np.random.normal(0, 5), 4),
            "crop":        crop_name,
        })

df_new_crops = pd.DataFrame(rows)
# Clip to valid ranges
df_new_crops["humidity"]    = df_new_crops["humidity"].clip(0, 100)
df_new_crops["ph"]          = df_new_crops["ph"].clip(0, 14)
df_new_crops["rainfall"]    = df_new_crops["rainfall"].clip(0, None)
df_new_crops["temperature"] = df_new_crops["temperature"].clip(-5, 55)
df_new_crops["n"]           = df_new_crops["n"].clip(0, None).round(2)
df_new_crops["p"]           = df_new_crops["p"].clip(0, None).round(2)
df_new_crops["k"]           = df_new_crops["k"].clip(0, None).round(2)

print(f"Synthetic new crop rows: {len(df_new_crops)}")
print(f"New crops added: {sorted(df_new_crops['crop'].unique())}")

# ── 4. Align and merge ────────────────────────────────────────────────────────
# Original uses lowercase column names
COLS = ["n", "p", "k", "temperature", "humidity", "ph", "rainfall", "crop"]

df_orig.columns = df_orig.columns.str.strip().str.lower()
# Rename N/P/K if uppercase
df_orig = df_orig.rename(columns={"n": "n", "p": "p", "k": "k"})

# Make sure label col is 'crop'
for possible in ["label", "crop"]:
    if possible in df_orig.columns:
        df_orig = df_orig.rename(columns={possible: "crop"})
        break

df_combined = pd.concat([df_orig[COLS], df_new_crops[COLS]], ignore_index=True)
df_combined = df_combined.dropna()

print(f"\nCombined dataset: {df_combined.shape[0]} rows")
print(f"Total unique crops: {df_combined['crop'].nunique()}")
print(f"All crops: {sorted(df_combined['crop'].unique())}")

# Save cleaned combined dataset
df_combined.to_csv("crop_dataset_combined.csv", index=False)
print("\n✅ Saved crop_dataset_combined.csv")

# ── 5. Train model ────────────────────────────────────────────────────────────
FEATURE_COLS = ["n", "p", "k", "temperature", "humidity", "ph", "rainfall"]
X = df_combined[FEATURE_COLS].values
y = df_combined["crop"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"\nTraining on {len(X_train)} samples, testing on {len(X_test)}...")
model = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1, max_depth=None)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ Model accuracy: {acc*100:.2f}%")
print("\nPer-crop report:")
print(classification_report(y_test, y_pred))

# ── 6. Save model ─────────────────────────────────────────────────────────────
joblib.dump(model, "crop_model.pkl")
print("✅ Saved crop_model.pkl — API will auto-load this on next request.")
