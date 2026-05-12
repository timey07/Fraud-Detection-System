from fastapi import FastAPI
from schemas import TransactionInput, PredictionOutput
from scorer import score_transaction

app = FastAPI(title="FDS ML Service")


@app.get("/")
def health():
    return {"status": "ok", "service": "ml-service"}


@app.post("/predict", response_model=PredictionOutput)
def predict(transaction: TransactionInput):
    result = score_transaction(transaction)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)