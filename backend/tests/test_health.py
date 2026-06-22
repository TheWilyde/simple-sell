from fastapi.testclient import TestClient
from app.main import app

# Initialize the test client with your FastAPI app
client = TestClient(app)

def test_read_root():
    # Send a GET request to the root endpoint
    response = client.get("/")
    
    # Assert that the server responds with a 200 OK status
    assert response.status_code == 200
    
    # Assert that the JSON payload matches our exact expectation
    assert response.json() == {"message": "API is running"}


def test_analyze_item_requires_groq_api_key():
    response = client.post(
        "/api/v1/analyze-item",
        data={"groq_api_key": ""},
        files={"file": ("item.jpg", b"image-bytes", "image/jpeg")},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Groq API key is required"}


def test_analyze_item_rejects_non_images():
    response = client.post(
        "/api/v1/analyze-item",
        data={"groq_api_key": "gsk_test"},
        files={"file": ("notes.txt", b"not an image", "text/plain")},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Only image files are accepted"}
