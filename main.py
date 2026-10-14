from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image, UnidentifiedImageError
import io

MODEL_ID = "JohnSupertramp2026/vit-base-plantvillage"

app = FastAPI(
    title="PlantCare AI API",
    description="Plant disease prediction using a pretrained model."
)

# Development/demo configuration. Restrict origins before production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

classifier = None

@app.on_event("startup")
def load_model():
    global classifier
    classifier = pipeline(
        "image-classification",
        model=MODEL_ID
    )

@app.get("/")
def home():
    return {
        "message": "PlantCare AI API is running!",
        "model": MODEL_ID
    }

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": classifier is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    allowed_types = {"image/jpeg", "image/png", "image/webp"}

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, or WEBP image."
        )

    image_bytes = await file.read()

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 10 MB."
        )

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file."
        )

    results = classifier(image, top_k=5)

    return {
        "filename": file.filename,
        "predictions": [
            {
                "label": item["label"],
                "confidence": round(float(item["score"]) * 100, 2)
            }
            for item in results
        ],
        "note": (
            "Estimates from a third-party pretrained model; "
            "not a confirmed diagnosis. Confidence is not guaranteed accuracy."
        ),
        "model": MODEL_ID
    }
