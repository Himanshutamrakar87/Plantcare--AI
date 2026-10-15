import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  FileCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';

interface ImageUploaderProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onDetect: () => void;
  isLoading: boolean;
  isBackendOnline: boolean;
  onOpenBackendSettings: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedFile,
  previewUrl,
  onFileSelect,
  onClear,
  onDetect,
  isLoading,
  isBackendOnline,
  onOpenBackendSettings,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 15 * 1024 * 1024; // 15MB

  const validateAndProcess = (file: File) => {
    setValidationError(null);

    // Validate type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    const isValidMime = allowedTypes.includes(file.type);

    if (!isValidExt && !isValidMime) {
      setValidationError(
        `Invalid file type (${file.type || ext}). Allowed formats: JPG, JPEG, PNG, WEBP.`
      );
      return;
    }

    // Validate size
    if (file.size > maxSizeBytes) {
      setValidationError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 15 MB limit. Please compress your image.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  // Helper to load sample test images as actual File objects
  const handleSelectSample = async (sampleType: 'tomato_blight' | 'healthy_corn' | 'potato_blight') => {
    setValidationError(null);
    let name = 'sample_tomato_early_blight.jpg';
    let sampleSvg = '';

    if (sampleType === 'tomato_blight') {
      name = 'tomato_early_blight_leaf.jpg';
      sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <rect width="600" height="600" fill="#2d3b2d"/>
        <path d="M300 80 C 440 180, 480 380, 300 520 C 120 380, 160 180, 300 80 Z" fill="#3f7a4d"/>
        <path d="M300 80 L300 520" stroke="#254a2e" stroke-width="8"/>
        <!-- Concentric necrotic lesions -->
        <circle cx="260" cy="240" r="38" fill="#5c3a21" stroke="#331c0e" stroke-width="4"/>
        <circle cx="260" cy="240" r="22" fill="#331c0e"/>
        <circle cx="340" cy="330" r="44" fill="#663e22" stroke="#2b170c" stroke-width="4"/>
        <circle cx="340" cy="330" r="26" fill="#2b170c"/>
        <circle cx="250" cy="390" r="28" fill="#52331c"/>
        <text x="300" y="560" font-family="sans-serif" font-size="20" fill="#d0ebd0" text-anchor="middle">Tomato Foliage Specimen: Alternaria Blight Lesions</text>
      </svg>`;
    } else if (sampleType === 'potato_blight') {
      name = 'potato_late_blight_leaf.jpg';
      sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <rect width="600" height="600" fill="#233027"/>
        <path d="M300 100 C 480 200, 460 420, 300 500 C 140 420, 120 200, 300 100 Z" fill="#3a6f4a"/>
        <path d="M300 100 L300 500" stroke="#1d4028" stroke-width="8"/>
        <path d="M220 200 Q 320 260 200 350 Z" fill="#33241b" opacity="0.85"/>
        <circle cx="350" cy="300" r="48" fill="#261b14"/>
        <text x="300" y="560" font-family="sans-serif" font-size="20" fill="#c0e5c0" text-anchor="middle">Potato Leaf: Water-soaked Phytophthora Lesion</text>
      </svg>`;
    } else {
      name = 'healthy_plant_specimen.jpg';
      sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <rect width="600" height="600" fill="#1b2d1f"/>
        <path d="M300 70 C 460 170, 490 380, 300 530 C 110 380, 140 170, 300 70 Z" fill="#2e8540"/>
        <path d="M300 70 L300 530" stroke="#1c5528" stroke-width="8"/>
        <path d="M300 200 L400 150" stroke="#1c5528" stroke-width="4"/>
        <path d="M300 300 L420 260" stroke="#1c5528" stroke-width="4"/>
        <path d="M300 240 L180 190" stroke="#1c5528" stroke-width="4"/>
        <path d="M300 350 L190 310" stroke="#1c5528" stroke-width="4"/>
        <text x="300" y="565" font-family="sans-serif" font-size="20" fill="#b9f0b9" text-anchor="middle">Vibrant Chlorophyll Foliage: Healthy Specimen</text>
      </svg>`;
    }

    const blob = new Blob([sampleSvg], { type: 'image/svg+xml' });
    const file = new File([blob], name, { type: 'image/jpeg' });
    onFileSelect(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box Card */}
      <div className="bg-white rounded-3xl border border-[#dce6d6] p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Upload Plant Leaf Image
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Take a clear, well-lit photo of an individual leaf showing healthy or symptomatic areas.
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {!previewUrl ? (
            /* Drag and drop zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-[#fbfdfa] hover:bg-emerald-50/30'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                  <Upload className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    Drag and drop your leaf photograph here
                  </p>
                  <p className="text-xs text-slate-600">
                    Supports <span className="font-semibold text-slate-700">JPG, JPEG, PNG, WEBP</span> up to 15 MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Browse File</span>
                </button>
              </div>
            </div>
          ) : (
            /* Image Preview Area */
            <div className="relative rounded-2xl border border-emerald-200 bg-[#f7faf5] p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Thumbnail Preview */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-sm shrink-0 bg-slate-900">
                  <img
                    src={previewUrl}
                    alt="Uploaded leaf specimen"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                    PREVIEW
                  </div>
                </div>

                {/* File Information & Remove Option */}
                <div className="flex-1 w-full space-y-2 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xs font-semibold">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Ready for Analysis</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate max-w-[280px]">
                        {selectedFile?.name}
                      </h4>
                    </div>

                    {/* Remove image button as requested */}
                    <button
                      onClick={onClear}
                      disabled={isLoading}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <span className="font-medium text-slate-700">Size:</span>{' '}
                      {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">Type:</span>{' '}
                      {selectedFile?.type || 'Image'}
                    </p>
                  </div>

                  {/* Backend Status Note */}
                  <div
                    className={`mt-2 p-2.5 rounded-lg text-xs flex items-center justify-between gap-2 ${
                      isBackendOnline
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isBackendOnline ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                      />
                      <span>
                        FastAPI Model:{' '}
                        <strong>{isBackendOnline ? 'Connected' : 'Offline'}</strong>
                      </span>
                    </div>
                    {!isBackendOnline && (
                      <button
                        onClick={onOpenBackendSettings}
                        className="text-[11px] underline font-semibold text-amber-900 hover:text-amber-950 cursor-pointer"
                      >
                        Settings
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Detect Disease & Change File */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={onDetect}
                  disabled={isLoading}
                  className={`w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    isLoading
                      ? 'bg-emerald-900 text-white opacity-85 cursor-wait'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white hover:shadow-lg hover:shadow-emerald-900/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Detecting Disease (FastAPI /predict)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Detect Disease</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Select Another Photo
                </button>
              </div>
            </div>
          )}

          {/* Validation error notice */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quick Sample Selector for immediate evaluation */}
          {!previewUrl && (
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Don't have a leaf image? Try these test specimens:</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectSample('tomato_blight')}
                  className="px-3 py-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-medium text-left transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="truncate">Tomato Early Blight</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('potato_blight')}
                  className="px-3 py-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-medium text-left transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="truncate">Potato Late Blight</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('healthy_corn')}
                  className="px-3 py-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-medium text-left transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">Healthy Specimen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
