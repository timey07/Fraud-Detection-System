from pydantic import BaseModel
from typing import List


class TransactionInput(BaseModel):
    amount: float
    hour: int
    device_trusted: int
    geo_distance: float
    velocity_5m: int
    merchant_risk: float


class PredictionOutput(BaseModel):
    fraud_probability: float
    anomaly_score: float
    risk_level: str
    reasons: List[str]