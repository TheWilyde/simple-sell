# simple-sell

simple-sell is an AI-assisted marketplace listing generator. Upload an item photo and the app returns a structured listing with a visual analysis, title, buyer-facing description, category, and estimated used-market price in USD.

## What It Includes

- React/Vite frontend for uploading an item image and reviewing the generated listing.
- FastAPI backend with an image-analysis endpoint.
- Groq vision model integration using Instructor and Pydantic response schemas.
- Evaluation fixtures under `backend/eval` for testing generated listings against sample items.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, pnpm.
- Backend: Python 3.14, FastAPI, uv, Groq SDK, Instructor, Pydantic.

## Setup

### Backend

```powershell
cd backend
uv sync
cp .env.example .env
```

Add your Groq API key to `backend/.env`:

```env
GROQ_API_KEY=your_key_here
```

Start the API:

```powershell
uv run uvicorn main:app --reload --app-dir app --port 8000
```

The backend runs at `http://localhost:8000`.

### Frontend

```powershell
cd frontend
pnpm install
pnpm dev
```

The frontend runs at `http://localhost:5173` and sends image uploads to the backend at `http://localhost:8000/api/v1/analyze-item`.

## API

`POST /api/v1/analyze-item`

Accepts a multipart image file named `file` and returns:

```json
{
  "listing": {
    "visual_analysis": "...",
    "title": "...",
    "description": "...",
    "category": "Electronics",
    "price": 99.0
  }
}
```

## Project Layout

```text
backend/
  app/        FastAPI app, AI service, and listing schemas
  eval/       Sample images, ground truth data, and evaluation scripts
frontend/
  src/        React UI, upload flow, and API client
```
