from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


class PredictionRequest(BaseModel):
    model_type: str = Field(..., pattern="^(disease|pest|soil)$")
    features: dict = Field(default_factory=dict)


class PredictionResponse(BaseModel):
    model_type: str
    prediction: str
    confidence: float
    details: dict


@router.post("", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    # Placeholder — wire up actual ML models here
    mock_results = {
        "disease": ("Phytophthora root rot", 0.87),
        "pest": ("Emerald ash borer", 0.92),
        "soil": ("Low nitrogen, adequate moisture", 0.78),
    }
    label, confidence = mock_results.get(request.model_type, ("Unknown", 0.0))

    return PredictionResponse(
        model_type=request.model_type,
        prediction=label,
        confidence=confidence,
        details={"status": "mock", "features_received": len(request.features)},
    )
