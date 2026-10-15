import React from 'react';
import {
  ScanLine,
  Bot,
  History,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Leaf,
  Sparkles,
  Zap,
  Globe2,
} from 'lucide-react';

interface HeroProps {
  onScanClick: () => void;
  onAssistantClick: () => void;
  onHistoryClick: () => void;
  onCareClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScanClick,
  onAssistantClick,
  onHistoryClick,
  onCareClick,
}) => {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#f0f6ed] via-[#f7faf4] to-white border border-[#dce8d6] p-6 sm:p-10 lg:p-14 shadow-sm">
        {/* Subtle decorative leaf background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-lime-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI-Powered Phytopathology & Plant Care</span>
          </div>

          {/* Welcome Heading as requested */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Keep Your Plants Healthy <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>

          {/* Short description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Early detection is the key to protecting crops and houseplants. Upload leaf photographs to detect fungal, bacterial, and pest pathologies instantly, receive organic remedy protocols, and consult our bilingual AI plant doctor.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onScanClick}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <ScanLine className="w-5 h-5 stroke-[2.2]" />
              <span>Scan a Plant</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={onAssistantClick}
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
            >
              <Bot className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
              <span>Ask Plant Doctor</span>
            </button>
          </div>

          {/* Trust badges strip */}
          <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>FastAPI Architecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Top-5 Confidence Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <span>English & Hindi Bilingual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Downloadable PDF Reports</span>
            </div>
          </div>
        </div>

        {/* Plant-Themed Visual Showcase */}
        <div className="relative mt-10 max-w-3xl mx-auto rounded-2xl bg-white/80 backdrop-blur-xs border border-emerald-200/80 p-4 sm:p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f8faf6] border border-emerald-100">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">38+ Crop Pathologies</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                  Trained for Tomato, Potato, Corn, Apple, Grape, Pepper & more.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f8faf6] border border-emerald-100">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Direct Python Integration</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                  Seamless multipart POST to your FastAPI model pipeline.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f8faf6] border border-emerald-100">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Zero Fake Diagnoses</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                  Strict integrity policy: real model predictions or clear connection state.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (As specifically required in prompt) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated Agricultural Health Suite
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Everything farmers, agronomists, and home gardeners need to diagnose and nurture resilient crops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1: Disease Detection */}
          <div
            onClick={onScanClick}
            className="group relative bg-white rounded-2xl border border-[#e2eade] p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ScanLine className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Disease Detection
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Upload leaf images (JPG, PNG, WEBP) to identify fungal, bacterial, and pest infections with confidence distribution.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
              <span>Start Diagnosis</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2: AI Plant Assistant */}
          <div
            onClick={onAssistantClick}
            className="group relative bg-white rounded-2xl border border-[#e2eade] p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Bot className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  AI Plant Assistant
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Ask questions in English or Hindi regarding watering routines, pest defense, organic fertilizers, and sunlight.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 group-hover:text-teal-900">
              <span>Chat with Assistant</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3: Plant Health History */}
          <div
            onClick={onHistoryClick}
            className="group relative bg-white rounded-2xl border border-[#e2eade] p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <History className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  Plant Health History
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Track previous scans, diagnosis dates, leaf thumbnails, and pathogen labels with database readiness.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-amber-700 group-hover:text-amber-900">
              <span>View Past Scans</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4: Health Reports */}
          <div
            onClick={onCareClick}
            className="group relative bg-white rounded-2xl border border-[#e2eade] p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Health Reports & Care
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Generate printable clinical plant health reports, organic treatment schedules, and preventative cultural advice.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
              <span>Explore Guidelines</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
