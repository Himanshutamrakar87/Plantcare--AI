import React from 'react';
import {
  X,
  Printer,
  FileDown,
  Sprout,
  ShieldAlert,
  Calendar,
  Layers,
  CheckCircle2,
  Info,
  Server,
} from 'lucide-react';
import { PredictResponse } from '../types';
import { formatDiseaseLabel, getCareRecommendation } from '../utils/careKnowledge';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionData: PredictResponse | null;
  previewUrl: string | null;
}

export const HealthReportModal: React.FC<HealthReportModalProps> = ({
  isOpen,
  onClose,
  predictionData,
  previewUrl,
}) => {
  if (!isOpen || !predictionData) return null;

  const predictions = predictionData.predictions || [];
  const topPrediction = predictions[0] || { label: 'Unknown', confidence: 0 };
  const formatted = formatDiseaseLabel(topPrediction.label);
  const carePlan = getCareRecommendation(topPrediction.label);
  const reportDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const reportId = `PCAI-${Date.now().toString(36).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header & Quick Actions */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-tight">
              Plant Health Clinical Report Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Integration Status Notice */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Client Report Engine Ready:</strong> Generates crisp printable PDF. Remote backend server-side PDF generator (<code className="font-mono">POST /report</code>) is marked pending backend implementation.
            </span>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          id="printable-plant-report"
          className="p-6 sm:p-10 space-y-8 bg-white text-slate-900 text-left max-h-[75vh] overflow-y-auto"
        >
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-emerald-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  PlantCare AI Diagnostic Report
                </h1>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Automated Foliar Pathology & Crop Health Assessment
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-0.5 sm:text-right">
              <div>
                Report ID: <span className="font-mono font-bold text-slate-800">{reportId}</span>
              </div>
              <div>
                Date: <span className="font-medium text-slate-800">{reportDate}</span>
              </div>
              <div>
                Specimen: <span className="font-mono text-slate-700">{predictionData.filename}</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Specimen Photograph */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Specimen Imagery
              </h3>
              <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Analyzed leaf specimen"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Specimen Image</span>
                )}
              </div>
            </div>

            {/* Primary Finding */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Diagnostic Finding
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-emerald-800">
                    Host Crop: {formatted.crop}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white font-mono">
                    {topPrediction.confidence}% Confidence
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatted.condition}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {carePlan.summary}
                </p>
              </div>

              {/* Predictions Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">
                  Model Probability Breakdown (Softmax)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Rank</th>
                        <th className="py-2 px-3">Pathology Label</th>
                        <th className="py-2 px-3 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {predictions.slice(0, 5).map((p, idx) => {
                        const rowFmt = formatDiseaseLabel(p.label);
                        return (
                          <tr key={idx} className={idx === 0 ? 'bg-emerald-50/40 font-bold' : ''}>
                            <td className="py-1.5 px-3 font-mono text-slate-500">#{idx + 1}</td>
                            <td className="py-1.5 px-3">
                              {rowFmt.crop} — {rowFmt.condition}
                            </td>
                            <td className="py-1.5 px-3 text-right font-mono">{p.confidence}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Care & Remediation Recommendations */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Recommended Agronomic Interventions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-900">Organic & Bio-Remedies</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {carePlan.organicRemedies.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-900">Cultural & Preventive Protocols</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {carePlan.preventiveMeasures.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-blue-900">Irrigation Management:</span>
              <p>{carePlan.wateringAdvice}</p>
            </div>
          </div>

          {/* Legal / Agronomic Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
            <strong>Standard Disclaimer:</strong> This report is algorithmically compiled by PlantCare AI for informational agricultural guidance based upon computer vision pattern matching. Crop diseases can exhibit cross-symptomatic patterns with nutritional deficiencies and abiotic environmental stresses. Verify findings with regional extension agents or university pathology labs.
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-mono">
            <span>PlantCare AI — Smart Plant Disease Detection & Care</span>
            <span>Report Auth: FASTAPI-MODEL-ENGINE v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
