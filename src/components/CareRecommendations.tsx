import React, { useState } from 'react';
import {
  ShieldCheck,
  Droplets,
  Sun,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { PredictResponse } from '../types';
import {
  getCareRecommendation,
  getGeneralCarePlan,
  formatDiseaseLabel,
} from '../utils/careKnowledge';

interface CareRecommendationsProps {
  predictionData: PredictResponse | null;
  onOpenReportModal?: () => void;
  onScanNewPlant?: () => void;
}

export const CareRecommendations: React.FC<CareRecommendationsProps> = ({
  predictionData,
  onOpenReportModal,
  onScanNewPlant,
}) => {
  const [selectedCropFilter, setSelectedCropFilter] = useState<'all' | 'tomato' | 'potato' | 'corn' | 'apple'>('all');

  const topPrediction = predictionData?.predictions?.[0];
  const hasActiveDiagnosis = Boolean(topPrediction);

  const carePlan = hasActiveDiagnosis
    ? getCareRecommendation(topPrediction?.label)
    : getGeneralCarePlan();

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the context: Target Diagnosis vs General Care */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xs ${
          hasActiveDiagnosis
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border-emerald-200'
            : 'bg-gradient-to-r from-slate-50 via-[#f8faf6] to-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  hasActiveDiagnosis
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {hasActiveDiagnosis
                  ? 'Active Scan Pathology Plan'
                  : 'General Preventive Plant Care'}
              </span>
              {hasActiveDiagnosis && (
                <span className="text-xs font-mono text-slate-600">
                  Confidence: {topPrediction?.confidence}%
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {carePlan.condition}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {hasActiveDiagnosis
                ? `Specific agronomic action plan tailored for detected condition on ${carePlan.crop}.`
                : 'Displaying universal preventative cultural recommendations. To see targeted pathology treatments, scan a symptomatic leaf in Disease Detection.'}
            </p>
          </div>

          {hasActiveDiagnosis && onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Full Clinical Report</span>
            </button>
          )}
        </div>

        {/* Diagnosis Distinction Notice as explicitly required in prompt */}
        <div
          className={`mt-5 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
            hasActiveDiagnosis
              ? 'bg-emerald-100/60 border-emerald-300/80 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-700" />
          <div className="leading-relaxed">
            <strong>Advisory Notice:</strong>{' '}
            {hasActiveDiagnosis
              ? 'These interventions are curated for the predicted condition. Do not apply chemical fungicides without calculating threshold severity and checking local environmental safety intervals.'
              : 'No leaf scan has been conducted in this session. The guidance below represents standard good agricultural and horticultural practices, not a diagnostic confirmation.'}
          </div>
        </div>
      </div>

      {/* Grid of Interventions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Organic & Biological Remedies */}
        <div className="bg-white rounded-2xl border border-[#dce8d6] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Organic & Bio-Remediation
              </h3>
              <p className="text-xs text-slate-600">Eco-friendly and natural treatments</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {carePlan.organicRemedies.map((remedy, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#f8faf6] border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{remedy}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preventative Cultural Practices */}
        <div className="bg-white rounded-2xl border border-[#dce8d6] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Prevention & Cultural Controls
              </h3>
              <p className="text-xs text-slate-600">Sanitation, airflow, and crop rotation</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {carePlan.preventiveMeasures.map((measure, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#f8faf6] border border-teal-100">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{measure}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Irrigation & Watering Guide */}
        <div className="bg-white rounded-2xl border border-[#dce8d6] p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Droplets className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Irrigation Strategy
              </h3>
              <p className="text-xs text-slate-600">Moisture regulation against root and leaf rots</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-[#f8faf6] p-3 rounded-xl border border-blue-100">
            {carePlan.wateringAdvice}
          </p>
        </div>

        {/* Sunlight & Soil Nutrition */}
        <div className="bg-white rounded-2xl border border-[#dce8d6] p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sun className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Sunlight & Soil Fertility
              </h3>
              <p className="text-xs text-slate-600">Optimizing plant vigor and systemic resistance</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-[#f8faf6] p-3 rounded-xl border border-amber-100">
            {carePlan.soilSunlightTips}
          </p>
        </div>
      </div>

      {/* Chemical controls if specified in the plan */}
      {carePlan.chemicalAdvice && (
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Targeted Chemical Fungicide / Bactericide Intervention</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {carePlan.chemicalAdvice}
          </p>
          <p className="text-[11px] text-slate-600">
            Note: Always wear protective equipment and observe harvest withholding periods printed on pesticide packaging.
          </p>
        </div>
      )}
    </div>
  );
};
