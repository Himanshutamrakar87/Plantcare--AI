import React, { useState } from 'react';
import {
  X,
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Bot,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { BackendStatus } from '../types';
import {
  getBackendBaseUrl,
  setBackendBaseUrl,
  resetBackendBaseUrl,
  getChatApiUrl,
  setChatApiUrl,
  checkBackendStatus,
} from '../services/api';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: BackendStatus;
  onStatusUpdated: (status: BackendStatus) => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onStatusUpdated,
}) => {
  const [apiUrl, setApiUrl] = useState(getBackendBaseUrl());
  const [chatUrl, setChatUrl] = useState(getChatApiUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'snippet'>('settings');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setBackendBaseUrl(apiUrl);
    const result = await checkBackendStatus(apiUrl);
    onStatusUpdated(result);
    setIsTesting(false);
  };

  const handleSave = () => {
    setBackendBaseUrl(apiUrl);
    setChatUrl(chatUrl);
    setChatApiUrl(chatUrl);
    handleTestConnection();
  };

  const handleReset = () => {
    resetBackendBaseUrl();
    const defaultUrl = getBackendBaseUrl();
    setApiUrl(defaultUrl);
  };

  const sampleFastApiCode = `# main.py - Complete FastAPI Backend for PlantCare AI
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
from PIL import Image

app = FastAPI(title="PlantCare AI Model Server", version="1.0.0")

# Enable CORS for the frontend applet
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "PlantCare AI Disease Classifier",
        "version": "1.0.0",
        "supported_crops": ["Tomato", "Potato", "Corn", "Apple", "Grape", "Pepper"]
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    # Validate image mime-type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")
    
    # Read image contents
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # ----------------------------------------------------
    # Insert your PyTorch / TensorFlow / ONNX model here
    # Example: model(image_tensor)
    # ----------------------------------------------------
    
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
        "note": "Foliar necrosis with concentric rings detected on primary leaflet."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleFastApiCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Backend Integration & API Settings
              </h3>
              <p className="text-[11px] text-slate-300">
                Connect your Python FastAPI model & Gemini chat route
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Endpoints & Health
          </button>
          <button
            onClick={() => setActiveTab('snippet')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'snippet'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>FastAPI Server Code (main.py)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {activeTab === 'settings' ? (
            <div className="space-y-5">
              {/* Live Status Card */}
              <div
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                  currentStatus.online
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {currentStatus.online ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Status: {currentStatus.online ? 'Online & Ready' : 'Disconnected'}
                    </h4>
                    <p className="text-xs mt-0.5 leading-relaxed">
                      {currentStatus.message}
                    </p>
                    {currentStatus.latencyMs !== undefined && (
                      <p className="text-[11px] font-mono mt-1 opacity-80">
                        Response Latency: {currentStatus.latencyMs} ms
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-700' : ''}`}
                  />
                  <span>{isTesting ? 'Pinging...' : 'Test GET /'}</span>
                </button>
              </div>

              {/* FastAPI Base URL input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>FastAPI Model Base URL (VITE_API_BASE_URL)</span>
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-emerald-800 underline font-normal"
                  >
                    Reset to default
                  </button>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs sm:text-sm text-slate-900 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Used for <code className="bg-slate-100 px-1 py-0.5 rounded">POST /predict</code> (multipart with field <code className="bg-slate-100 px-1 py-0.5 rounded">file</code>) and <code className="bg-slate-100 px-1 py-0.5 rounded">GET /</code> status check.
                </p>
              </div>

              {/* Gemini Chatbot URL input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Gemini Chatbot Endpoint URL</span>
                </label>
                <input
                  type="text"
                  value={chatUrl}
                  onChange={(e) => setChatUrl(e.target.value)}
                  placeholder="/api/chat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs sm:text-sm text-slate-900 bg-white"
                />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Defaults to the built-in server route <code className="bg-slate-100 px-1 py-0.5 rounded">/api/chat</code> which securely calls Gemini with your environment key.
                </p>
              </div>

              {/* Quick instructions */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">
                  Quick Start Guide for Python Backend:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>Install dependencies: <code className="bg-slate-200 px-1 rounded font-mono">pip install fastapi uvicorn pillow</code></li>
                  <li>Copy the starter code from the <strong>FastAPI Server Code</strong> tab into <code className="bg-slate-200 px-1 rounded font-mono">main.py</code></li>
                  <li>Run: <code className="bg-slate-200 px-1 rounded font-mono">uvicorn main:app --reload --port 8000</code></li>
                  <li>Click <strong>Test GET /</strong> above to verify connection!</li>
                </ol>
              </div>
            </div>
          ) : (
            /* FastAPI Sample Code Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  FastAPI Server Template (<code className="font-mono">main.py</code>)
                </span>
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-[380px] leading-relaxed border border-slate-800">
                {sampleFastApiCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Apply & Test
          </button>
        </div>
      </div>
    </div>
  );
};
