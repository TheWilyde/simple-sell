import os
from fastapi import FastAPI, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import AuthenticationError, PermissionDeniedError, RateLimitError
from app.ai_service import generate_listing
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "https://simplesell.netlify.app/",
    "https://simplesell.wilyde.com/"
]

production_frontend = os.getenv("FRONTEND_URL")
if production_frontend:
    origins.append(production_frontend)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints
@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/api/v1/analyze-item",)
async def analyzeItem(file: UploadFile, groq_api_key: str = Form("")):
    if not groq_api_key.strip():
        raise HTTPException(status_code=400, detail="Groq API key is required")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")
    else:
        image = await file.read()
        try:
            listing = await generate_listing(groq_api_key.strip(), image)
            return {"listing": listing}
        except (AuthenticationError, PermissionDeniedError):
            raise HTTPException(status_code=401, detail="Groq API key was rejected")
        except RateLimitError:
            raise HTTPException(status_code=429, detail="Groq rate limit exceeded")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=503, detail="AI provider is facing issues!")
