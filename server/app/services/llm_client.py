import json
from typing import Any, Dict

from openai import OpenAI

from app.config import OPENAI_API_KEY
from app.models import SentimentResponse

client = OpenAI(api_key=OPENAI_API_KEY)


SYSTEM_PROMPT = """
You are a sentiment and keyword analysis service.

Given a piece of text spoken by a human, you MUST respond ONLY with a JSON object
with this exact shape:

{
  "sentiment_score": <number between 0 and 1>,
  "sentiment_label": "negative" | "neutral" | "positive",
  "keywords": ["keyword1", "keyword2", ...]
}

Rules:
- sentiment_score: 0 = very negative, 0.5 = neutral, 1 = very positive.
- sentiment_label must match the score (0..0.4 = negative, 0.4..0.6 = neutral, 0.6..1 = positive).
- keywords: 3 to 8 short phrases capturing key topics or emotions.
- No explanation, no extra fields, only that JSON object.
""".strip()


def analyze_text(text: str) -> SentimentResponse:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        temperature=0.2,
    )

    content = response.choices[0].message.content
    data: Dict[str, Any] = json.loads(content)

    score = float(data.get("sentiment_score", 0.5))
    label = data.get("sentiment_label", "neutral")
    keywords = data.get("keywords", [])

    if not isinstance(keywords, list):
        keywords = []

    keywords = [str(k) for k in keywords][:10]

    return SentimentResponse(
        sentiment_score=score,
        sentiment_label=label,
        keywords=keywords,
    )
