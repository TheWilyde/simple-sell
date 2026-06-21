from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_service import groq_client, generate_listing
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Pydantic Models
class ChatResponse(BaseModel):
    response: str

# Endpoints
@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/api/v1/analyze-item",)
async def analyzeItem(file: UploadFile):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")
    else:
        image = await file.read()
        try:
            listing = await generate_listing(groq_client, image)
            return {"listing": listing}
        except Exception as e:
            print(e)
            raise HTTPException(status_code=503, detail="AI provider is facing issues!")