from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import ProcessTextRequest, SentimentResponse
from app.services.llm_client import analyze_text

app = FastAPI()

# CORS – allow frontend during dev
# In your server code, update CORS:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://sentiment-aura-chi.vercel.app"
        "https://sentiment-aura-w6q6-git-main-jai-vigneshs-projects.vercel.app",

    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/process_text", response_model=SentimentResponse)
def process_text(payload: ProcessTextRequest):
    try:
        return analyze_text(payload.text)
    except Exception as e:
        
        raise HTTPException(status_code=500, detail="Failed to analyze text")
