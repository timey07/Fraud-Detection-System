# AI Fraud Detection System

Real-time AI-powered fraud detection platform that combines machine learning scoring, anomaly detection, rule-based decisioning, and analyst review workflows.

This project simulates how modern fintech systems evaluate payment transactions using both predictive models and business logic before approving, flagging, or blocking them.

---

# Features

- Real-time transaction scoring
- ML-based fraud probability prediction
- Anomaly detection engine
- Rule-based decision overrides
- Explainable fraud reasoning
- Analyst review workflow
- Transaction audit storage
- Full-stack architecture
- REST API integration
- Modular microservice-inspired design

---

# Architecture

```text
Frontend (Next.js)
        ↓
API Gateway (Node.js / Express)
        ↓
ML Service (FastAPI + scikit-learn)
        ↓
PostgreSQL / Supabase
```

---

# System Flow

1. Client submits transaction from frontend
2. API Gateway validates incoming payload
3. Transaction is forwarded to the ML Service
4. ML Service generates:
   - Fraud probability
   - Anomaly score
   - Risk classification
5. Decision Engine applies business rules
6. Final decision is generated:
   - APPROVED
   - FLAGGED
   - BLOCKED
7. Transaction and analysis are stored in database
8. Response is returned to frontend dashboard

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS

## Backend API
- Node.js
- Express.js
- Supabase/PostgreSQL

## ML Service
- Python
- FastAPI
- scikit-learn
- Pickle models

---

# Project Structure

```text
Fraud-Detection-System/
│
├── api/                # Express API Gateway
├── frontend/           # Next.js Frontend
├── ml-service/         # Python ML Service
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# Fraud Detection Logic

The system combines:

## 1. Machine Learning Fraud Prediction
A trained ML model predicts the likelihood of fraud using transaction features such as:
- amount
- merchant risk
- transaction velocity
- geo distance
- trusted device status

---

## 2. Anomaly Detection
An anomaly model evaluates unusual transaction behavior patterns.

---

## 3. Rule-Based Decision Engine
Business rules override model output when critical conditions occur.

Example:
- Extremely high fraud score → BLOCKED
- High transaction velocity → FLAGGED
- High anomaly score → FLAGGED

This mimics real-world fintech fraud systems where rules and ML coexist.

---

# Example Transaction Request

```json
POST /transactions

{
  "userId": "user_101",
  "amount": 4500,
  "merchant": "Amazon",
  "hour": 2,
  "deviceTrusted": 0,
  "geoDistance": 350,
  "velocity5m": 5,
  "merchantRisk": 0.82
}
```

---

# Example Response

```json
{
  "decision": "FLAGGED",
  "fraud_probability": 0.82,
  "anomaly_score": 0.71,
  "risk_level": "HIGH",
  "reasons": [
    "High transaction velocity",
    "Suspicious geo distance"
  ]
}
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/your-username/Fraud-Detection-System.git
cd Fraud-Detection-System
```

---

# Environment Variables

## API

Create:

```text
api/.env
```

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ML_SERVICE_URL=http://localhost:8000
```

---

## Frontend

Create:

```text
frontend/.env.local
```

```env
BACKEND_URL=http://localhost:5000
```

---

# Run Backend API

```bash
cd api
npm install
npm start
```

Server runs on:

```text
http://localhost:5000
```

---

# Run ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

ML service runs on:

```text
http://localhost:8000
```

---

# Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Future Improvements

- JWT authentication
- Kafka event streaming
- Redis caching
- Docker deployment
- Kubernetes orchestration
- Real-time monitoring dashboard
- Analyst admin panel
- Model retraining pipeline
- CI/CD automation
- Advanced feature engineering

---

# Use Cases

- Payment fraud detection
- Banking transaction monitoring
- Fintech risk analysis
- AML preprocessing systems
- Merchant risk scoring
- Real-time transaction auditing

---

# Learning Outcomes

This project demonstrates:
- Backend system design
- ML service integration
- REST API architecture
- Real-time scoring pipelines
- Fraud decision systems
- Full-stack integration
- Database persistence
- Explainable AI workflows

---

# License

This project is licensed under the MIT License.
