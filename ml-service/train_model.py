import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier, IsolationForest


# -----------------------------
# 1. Generate synthetic data
# -----------------------------
np.random.seed(42)
n = 5000

data = pd.DataFrame({
    "amount": np.random.uniform(100, 20000, n),
    "hour": np.random.randint(0, 24, n),
    "device_trusted": np.random.randint(0, 2, n),
    "geo_distance": np.random.uniform(1, 2000, n),
    "velocity_5m": np.random.randint(1, 8, n),
    "merchant_risk": np.random.uniform(0, 1, n),
})

# -----------------------------
# 2. Create fraud labels
# -----------------------------
fraud_score = (
    (data["amount"] > 10000).astype(int) +
    (data["hour"] < 5).astype(int) +
    (data["device_trusted"] == 0).astype(int) +
    (data["geo_distance"] > 500).astype(int) +
    (data["velocity_5m"] > 3).astype(int) +
    (data["merchant_risk"] > 0.7).astype(int)
)

# Mark as fraud if enough suspicious conditions are met
data["fraud"] = (fraud_score >= 3).astype(int)

# -----------------------------
# 3. Features / labels
# -----------------------------
X = data[[
    "amount",
    "hour",
    "device_trusted",
    "geo_distance",
    "velocity_5m",
    "merchant_risk"
]]

y = data["fraud"]

# -----------------------------
# 4. Train fraud classifier
# -----------------------------
fraud_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=6,
    random_state=42
)

fraud_model.fit(X, y)

# -----------------------------
# 5. Train anomaly detector
# -----------------------------
anomaly_model = IsolationForest(
    contamination=0.12,
    random_state=42
)

anomaly_model.fit(X)

# -----------------------------
# 6. Save models
# -----------------------------
joblib.dump(fraud_model, "fraud_model.pkl")
joblib.dump(anomaly_model, "anomaly_model.pkl")

print("Models trained and saved successfully.")