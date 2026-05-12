import joblib
import numpy as np

# Load trained models once at startup
fraud_model = joblib.load("fraud_model.pkl")
anomaly_model = joblib.load("anomaly_model.pkl")


def score_transaction(txn):
    # Feature order must match training
    features = np.array([[
        txn.amount,
        txn.hour,
        txn.device_trusted,
        txn.geo_distance,
        txn.velocity_5m,
        txn.merchant_risk
    ]])

    # Fraud probability from classifier
    fraud_probability = float(fraud_model.predict_proba(features)[0][1])

    # IsolationForest anomaly score
    raw_anomaly = anomaly_model.decision_function(features)[0]

    # Convert to human-friendly anomaly score (0 to 1, higher = more suspicious)
    anomaly_score = float(max(0, min(1, 1 - ((raw_anomaly + 0.5) / 1.0))))

    # Risk band
    if fraud_probability >= 0.75:
        risk_level = "HIGH"
    elif fraud_probability >= 0.40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Explainability layer
    reasons = generate_reasons(txn)

    return {
        "fraud_probability": round(fraud_probability, 2),
        "anomaly_score": round(anomaly_score, 2),
        "risk_level": risk_level,
        "reasons": reasons
    }

def generate_reasons(txn):
    reasons = []

    if txn.amount > 10000:
        reasons.append("High transaction amount")

    if txn.hour < 5:
        reasons.append("Unusual transaction hour")

    if txn.device_trusted == 0:
        reasons.append("Untrusted device")

    if txn.geo_distance > 500:
        reasons.append("Unusual transaction location")

    if txn.velocity_5m > 3:
        reasons.append("High transaction velocity")

    if txn.merchant_risk > 0.7:
        reasons.append("High-risk merchant")

    if not reasons:
        reasons.append("No strong fraud indicators detected")

    return reasons