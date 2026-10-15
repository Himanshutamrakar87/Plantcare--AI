import React from 'react';
import {
  ShieldAlert,
  AlertCircle,
  FileDown,
  Bot,
  CheckCircle,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { PredictResponse, BackendStatus } from '../types';
import { formatDiseaseLabel, getCareRecommendation } from '../utils/careKnowledge';

interface PredictionResultsProps {
  predictionData: PredictResponse | null;
  previewUrl: string | null;
  backendStatus: BackendStatus;
  onOpenReportModal: () => void;
  onConsultAssistant: (diseaseContext: string) => void;
  onOpenBackendSettings: () => void;
  errorMessage?: string | null;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({
  predictionData,
  previewUrl,
  backendStatus,
  onOpenReportModal,
  onConsultAssistant,
  onOpenBackendSettings,
  errorMessage,
}) => {
  // If an error occurred during detection
  if (errorMessage) {
    return (
      <div className="bg-white rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Disease Detection Failed
            </h3>
            <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
          <p className="font-semibold text-slate-700">Troubleshooting Steps:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li><strong>Local testing:</strong> If running FastAPI locally, run this app locally at <code className="bg-slate-200 px-1 py-0.5 rounded">http://localhost:3000</code> (<code className="bg-slate-200 px-1 py-0.5 rounded">npm run dev</code>) so browser Mixed Content security does not block requests.</li>
            <li><strong>Cloud preview testing:</strong> If viewing from this cloud preview, deploy your FastAPI backend to a public HTTPS URL (e.g. Hugging Face Space or ngrok) and update the URL in Settings.</li>
            <li>Confirm CORS middleware allows browser origins: <code className="bg-slate-200 px-1 py-0.5 rounded">allow_origins=["*"]</code></li>
            <li>Ensure the endpoint expects multipart field name <code className="bg-slate-200 px-1 py-0.5 rounded">file</code> on <code className="bg-slate-200 px-1 py-0.5 rounded">POST /predict</code></li>
          </ul>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onOpenBackendSettings}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Check Backend Settings & Code
          </button>
        </div>
      </div>
    );
  }

  // When no prediction is yet available (Waiting for backend or awaiting upload)
  if (!predictionData) {
    return (
      <div className="bg-white rounded-3xl border border-[#dce6d6] p-6 sm:p-10 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
          <Server className="w-8 h-8 stroke-[1.8]" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-extrabold text-slate-900">
            Awaiting Live Model Prediction
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PlantCare AI maintains strict agricultural data integrity. We do not invent simulated diagnosis scores. Upload a leaf photo and click <strong>Detect Disease</strong> to query your FastAPI model.
          </p>
        </div>

        {/* Backend Status indicator banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8faf6] border border-[#e2eade] text-xs font-medium text-slate-700">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              backendStatus.online ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
          />
          <span>FastAPI Target: <code className="text-slate-800 font-mono">{backendStatus.baseUrl}</code></span>
          <button
            onClick={onOpenBackendSettings}
            className="ml-2 text-emerald-800 underline font-semibold text-[11px] cursor-pointer"
          >
            Configure
          </button>
        </div>
      </div>
    );
  }

  // REAL PREDICTIONS DISPLAY
  const predictions = predictionData.predictions || [];
  const topPrediction = predictions[0] || { label: 'Unknown Condition', confidence: 0 };
  const top5 = predictions.slice(0, 5);

  const formattedTop = formatDiseaseLabel(topPrediction.label);
  const carePlan = getCareRecommendation(topPrediction.label);

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (confidence >= 50) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-emerald-600';
    if (confidence >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Top Prediction Summary Banner */}
      <div className="bg-white rounded-3xl border border-[#d6e3cf] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Primary Diagnosis Result
              </span>
              <span className="text-xs text-slate-600 font-mono">
                {predictionData.filename}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formattedTop.condition}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Affecting host crop: <strong className="text-slate-800">{formattedTop.crop}</strong>
            </p>
          </div>

          {/* Confidence Meter Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2.5 rounded-2xl border text-center shadow-xs ${getConfidenceBadgeColor(
                topPrediction.confidence
              )}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Confidence
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono">
                {topPrediction.confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* Backend Note if supplied */}
        {predictionData.note && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Backend Model Note:</span> {predictionData.note}
            </div>
          </div>
        )}

        {/* Top 5 Predictions Breakdown (As requested in prompt) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Top 5 Probabilistic Predictions</span>
            </h4>
            <span className="text-[11px] text-slate-600">FastAPI Model Softmax Distribution</span>
          </div>

          <div className="space-y-2.5 bg-[#fbfdfa] rounded-2xl p-4 border border-[#e2ebde]">
            {top5.map((item, index) => {
              const formattedItem = formatDiseaseLabel(item.label);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[260px] sm:max-w-md">
                      <span className="text-slate-600 font-mono mr-1.5">#{index + 1}</span>
                      {formattedItem.crop} — {formattedItem.condition}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {item.confidence}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getConfidenceBarColor(
                        item.confidence
                      )}`}
                      style={{ width: `${Math.max(item.confidence, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Download PDF Report & Consult Chatbot */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={() => onConsultAssistant(`${formattedTop.crop} - ${formattedTop.condition}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Assistant About This Treatment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Required Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Diagnostic Disclaimer:</strong> PlantCare AI predictions are probabilistic algorithmic estimates based on image pattern analysis and do not constitute certified biological or agricultural laboratory diagnoses. Before executing major chemical eradication or crop culling, verify severe cases with your regional agricultural extension service or certified plant agronomist.
          </div>
        </div>
      </div>
    </div>
  );
};
