from pydantic import BaseModel, Field
from typing import List, Literal


class ProcessTextRequest(BaseModel):
    text: str = Field(..., min_length=1)


class SentimentResponse(BaseModel):
    sentiment_score: float  # 0.0 to 1.0
    sentiment_label: Literal["negative", "neutral", "positive"]
    keywords: List[str]
