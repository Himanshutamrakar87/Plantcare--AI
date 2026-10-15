/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ImageUploader } from './components/ImageUploader';
import { PredictionResults } from './components/PredictionResults';
import { Chatbot } from './components/Chatbot';
import { CareRecommendations } from './components/CareRecommendations';
import { HistoryView } from './components/HistoryView';
import { HealthReportModal } from './components/HealthReportModal';
import { BackendConfigModal } from './components/BackendConfigModal';
import {
  PredictResponse,
  BackendStatus,
  ScanHistoryItem,
} from './types';
import {
  checkBackendStatus,
  predictPlantDisease,
  getBackendBaseUrl,
} from './services/api';
import {
  Sprout,
  Activity,
  MessageSquareText,
  ShieldCheck,
  History,
  AlertCircle,
  FileText,
  ExternalLink,
  Heart,
  Server,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'plantcare_scan_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'detect' | 'chat' | 'care' | 'history'>('home');
  
  // File & Prediction States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictResponse | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Assistant context
  const [activePlantContext, setActivePlantContext] = useState<string | null>(null);

  // History State
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  // Backend connection state
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    online: false,
    checkedAt: new Date().toISOString(),
    message: 'Checking connection to FastAPI backend...',
    baseUrl: getBackendBaseUrl(),
  });

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        setScanHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read scan history from storage:', e);
    }
  }, []);

  // Check FastAPI backend status on mount
  useEffect(() => {
    refreshBackendStatus();
  }, []);

  const refreshBackendStatus = async () => {
    const status = await checkBackendStatus();
    setBackendStatus(status);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPredictionError(null);

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClearFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictionData(null);
    setPredictionError(null);
  };

  const handleDetectDisease = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setPredictionError(null);

    try {
      const result = await predictPlantDisease(selectedFile);
      setPredictionData(result);

      // Set active context for chatbot
      if (result.predictions.length > 0) {
        const top = result.predictions[0];
        setActivePlantContext(`${top.label} (${top.confidence}% confidence)`);
      }

      // Save to history
      if (result.predictions.length > 0 && previewUrl) {
        const newHistoryItem: ScanHistoryItem = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toISOString(),
          filename: result.filename || selectedFile.name,
          imageUrl: previewUrl,
          predictions: result.predictions,
          topLabel: result.predictions[0].label,
          topConfidence: result.predictions[0].confidence,
          note: result.note,
        };

        const updatedHistory = [newHistoryItem, ...scanHistory.slice(0, 19)];
        setScanHistory(updatedHistory);
        try {
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
      }
    } catch (err: any) {
      console.warn('FastAPI prediction notice:', err?.message || err);
      setPredictionError(
        err.message ||
          'Failed to connect to FastAPI model server. Please verify the server is running on the configured port.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setPreviewUrl(item.imageUrl);
    setPredictionData({
      filename: item.filename,
      predictions: item.predictions,
      note: item.note,
    });
    setActivePlantContext(`${item.topLabel} (${item.topConfidence}% confidence)`);
    setActiveTab('care');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = scanHistory.filter((item) => item.id !== id);
    setScanHistory(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your local plant scan history?')) {
      setScanHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  };

  const handleConsultAssistant = (diseaseContext: string) => {
    setActivePlantContext(diseaseContext);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#fbfbf6] text-slate-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onRefreshBackend={refreshBackendStatus}
        onOpenBackendSettings={() => setIsBackendModalOpen(true)}
        historyCount={scanHistory.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: HOME / DASHBOARD */}
        {activeTab === 'home' && (
          <Hero
            onScanClick={() => setActiveTab('detect')}
            onAssistantClick={() => setActiveTab('chat')}
            onHistoryClick={() => setActiveTab('history')}
            onCareClick={() => setActiveTab('care')}
          />
        )}

        {/* TAB 2: DISEASE DETECTION */}
        {activeTab === 'detect' && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Plant Disease Detection Scanner
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Upload high-resolution leaf photographs to query your Python FastAPI machine learning classifier.
              </p>
            </div>

            {/* Uploader Box */}
            <ImageUploader
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onClear={handleClearFile}
              onDetect={handleDetectDisease}
              isLoading={isLoading}
              isBackendOnline={backendStatus.online}
              onOpenBackendSettings={() => setIsBackendModalOpen(true)}
            />

            {/* Results Section */}
            <PredictionResults
              predictionData={predictionData}
              previewUrl={previewUrl}
              backendStatus={backendStatus}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onConsultAssistant={handleConsultAssistant}
              onOpenBackendSettings={() => setIsBackendModalOpen(true)}
              errorMessage={predictionError}
            />
          </div>
        )}

        {/* TAB 3: AI PLANT ASSISTANT CHATBOT */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Plant Assistant Chatbot
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Ask agronomical questions regarding watering, sunlight, soil fertility, and organic pest defense in English or Hindi.
              </p>
            </div>

            <Chatbot
              activePlantContext={activePlantContext}
              onClearContext={() => setActivePlantContext(null)}
            />
          </div>
        )}

        {/* TAB 4: SMART CARE RECOMMENDATIONS */}
        {activeTab === 'care' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Smart Care & Pathology Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Agronomic treatment plans, organic bio-remedies, and preventative cultural protocols.
              </p>
            </div>

            <CareRecommendations
              predictionData={predictionData}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onScanNewPlant={() => setActiveTab('detect')}
            />
          </div>
        )}

        {/* TAB 5: PLANT HEALTH HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <HistoryView
              historyItems={scanHistory}
              onSelectScan={handleSelectHistoryItem}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              onNavigateToScan={() => setActiveTab('detect')}
            />
          </div>
        )}
      </main>

      {/* PDF Health Report Printable Modal */}
      <HealthReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        predictionData={predictionData}
        previewUrl={previewUrl}
      />

      {/* Backend & API Settings Modal */}
      <BackendConfigModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        currentStatus={backendStatus}
        onStatusUpdated={setBackendStatus}
      />

      {/* Modern AgriTech Footer */}
      <footer className="mt-auto border-t border-[#e2eade] bg-white text-xs text-slate-600 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">
                PlantCare AI
              </span>
              <span className="text-[11px] text-slate-600">
                — Smart Plant Disease Detection & Care Assistant
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('detect')}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                Scan Plant
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className="hover:text-emerald-800 transition-colors cursor-pointer"
              >
                Care Guidelines
              </button>
              <button
                onClick={() => setIsBackendModalOpen(true)}
                className="hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Server className="w-3 h-3 text-emerald-700" />
                <span>API Settings</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
            <p>
              Designed for growers, agronomists, and home gardeners. AI predictions are algorithmic estimates and not certified lab diagnoses.
            </p>
            <p className="font-mono text-slate-600">
              FastAPI: <span className={backendStatus.online ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>{backendStatus.online ? 'Online' : 'Offline'}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
