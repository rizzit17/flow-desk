from fastapi import FastAPI
from pydantic import BaseModel
from classifier import classify_ticket

app = FastAPI(title="FlowDesk Classification Service")

class ClassifyRequest(BaseModel):
    title: str
    description: str

class ClassifyResponse(BaseModel):
    category: str
    urgencyScore: int
    confidence: float

@app.post("/classify", response_model=ClassifyResponse)
def classify_endpoint(request: ClassifyRequest):
    category, urgency_score, confidence = classify_ticket(request.title, request.description)
    return ClassifyResponse(
        category=category,
        urgencyScore=urgency_score,
        confidence=confidence
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
