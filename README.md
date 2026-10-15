# PlantCare AI — Smart Plant Disease Detection & Care Assistant

A modern agricultural technology web application for early crop disease detection, smart organic care recommendations, and multilingual agronomic assistance.

---

## Key Features

1. **Home / Dashboard**:
   - Welcome banner: *"Keep Your Plants Healthy with AI"*
   - Fast access to plant scanning, AI chatbot, diagnostic archives, and care guidelines
   - Visual badges and quick metrics on supported crop pathologies

2. **Disease Detection (FastAPI Model Integration)**:
   - Supports **JPG, JPEG, PNG, and WEBP** leaf images up to 15 MB
   - Drag-and-drop zone, browse-file selector, high-res preview, remove-image option, and file validations
   - Instant test specimen buttons for immediate evaluation
   - Connects directly to your Python FastAPI `POST /predict` endpoint using `multipart/form-data` with field name `file`
   - Displays primary diagnosed pathology, confidence percentage, and the top-5 model predictions
   - Strict data integrity policy: no simulated or fabricated prediction scores when disconnected
   - Agronomic safety disclaimer

3. **AI Plant Assistant Chatbot**:
   - Powered by Gemini via a secure server endpoint (`/api/chat`), keeping API keys out of client code
   - Bilingual conversational support in **English and हिंदी (Hindi)**
   - Pre-configured suggested questions:
     - *"How often should I water my tomato plant?"*
     - *"How can I prevent leaf diseases?"*
     - *"How much sunlight does my plant need?"*
     - *"घर पर जैविक नीम स्प्रे कैसे बनाएं?"*
   - Active scan context injection: seamlessly passes scanned crop diagnosis to Gemini for tailored advice

4. **Smart Care Recommendations**:
   - Disease-specific remediation plans (organic bio-fungicides, IPM, cultural practices, watering adjustments)
   - Clearly distinguishes between targeted disease prescriptions and general preventative advice

5. **Plant Health History**:
   - Local storage persistence tracking previous scans, timestamps, leaf thumbnails, and disease labels
   - Search & filter by crop or condition
   - Prepared for future database synchronization
   - Clear empty state when no scans have been performed

6. **Plant Health Report**:
   - Interactive printable report preview with full `@media print` styling
   - Formatted for "Print to PDF" with specimen photo, confidence breakdown table, and care protocols
   - Displays integration status for remote server-side PDF generation

7. **Backend Configuration & Live Health Ping**:
   - In-app modal to configure `VITE_API_BASE_URL` (default: `http://localhost:8000`)
   - Real-time `GET /` latency testing and CORS troubleshooting
   - Copy-paste ready Python FastAPI starter code (`main.py`)

---

## How to Run the Frontend Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Contents of `.env`:
```env
# URL where your Python FastAPI backend is hosted
VITE_API_BASE_URL="http://localhost:8000"

# Optional: Gemini API key for server-side AI chatbot
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## How to Run the Python FastAPI Backend

### 1. Create a Python Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install FastAPI & Dependencies
```bash
pip install fastapi uvicorn pillow python-multipart
```

### 3. Create `main.py`
Create a file named `main.py` in your backend folder with the following code:

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
from PIL import Image

app = FastAPI(title="PlantCare AI Model Server", version="1.0.0")

# Crucial: Enable CORS so your browser frontend can reach the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    """Health check endpoint used by the frontend status pill."""
    return {
        "status": "healthy",
        "service": "PlantCare AI Disease Classifier",
        "version": "1.0.0",
        "supported_crops": ["Tomato", "Potato", "Corn", "Apple", "Grape", "Pepper"]
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Receives leaf photograph under the multipart form field name 'file'
    and returns top disease predictions.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")
    
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # --- Place your model inference here ---
    # Example:
    # tensor = transform(image)
    # output = model(tensor)
    # ...
    
    # Return formatted predictions
    return {
        "filename": file.filename,
        "predictions": [
            {"label": "Tomato___Early_blight", "confidence": 94.8},
            {"label": "Tomato___Septoria_leaf_spot", "confidence": 3.2},
            {"label": "Tomato___Bacterial_spot", "confidence": 1.1},
            {"label": "Tomato___Target_Spot", "confidence": 0.6},
            {"label": "Tomato___healthy", "confidence": 0.3}
        ],
        "note": "Concentric ring spots identified on foliar leaflet."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

### 4. Start the FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```

The status pill in the PlantCare AI web app will instantly turn green (**FastAPI Connected**) once the server is running on `http://localhost:8000`.

---

## Production Build

To compile and build the production bundle:
```bash
npm run build
```

To run the production server:
```bash
npm run start
```
