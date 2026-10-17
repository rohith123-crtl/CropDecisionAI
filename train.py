from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load agricultural dataset
base_dir = Path(__file__).resolve().parent
data = pd.read_csv(base_dir / "Crop_recommendation.csv")

# Core environmental and soil features
X = data[["N", "P", "K", "ph", "temperature", "humidity", "rainfall"]]
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Initialize and train the Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model for backend use
model_path = base_dir / "crop_model.pkl"
joblib.dump(model, model_path)
print(f"Model trained and saved to: {model_path}")