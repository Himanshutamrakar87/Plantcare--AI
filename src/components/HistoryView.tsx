import React, { useState } from 'react';
import {
  History,
  Trash2,
  Calendar,
  ExternalLink,
  Search,
  Database,
  ArrowRight,
  ShieldCheck,
  FileDown,
  Layers,
  Sprout,
} from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { formatDiseaseLabel } from '../utils/careKnowledge';

interface HistoryViewProps {
  historyItems: ScanHistoryItem[];
  onSelectScan: (item: ScanHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onNavigateToScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onSelectScan,
  onDeleteItem,
  onClearAll,
  onNavigateToScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = historyItems.filter((item) => {
    const formatted = formatDiseaseLabel(item.topLabel);
    const search = searchTerm.toLowerCase();
    return (
      item.filename.toLowerCase().includes(search) ||
      item.topLabel.toLowerCase().includes(search) ||
      formatted.condition.toLowerCase().includes(search) ||
      formatted.crop.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Card & DB status header */}
      <div className="bg-white rounded-3xl border border-[#dce8d6] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Diagnostic Archives
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                <Database className="w-3 h-3 text-slate-600" />
                <span>Ready for Remote DB Sync</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Plant Health Scan History
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Audit trail of previous leaf scans, confidence metrics, and diagnosed conditions.
            </p>
          </div>

          {historyItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {historyItems.length > 0 && (
          <div className="relative pt-2">
            <Search className="absolute left-3.5 top-5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by crop, disease name, or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-xs sm:text-sm text-slate-900 bg-[#fbfdfa]"
            />
          </div>
        )}
      </div>

      {/* History List or Empty State */}
      {historyItems.length === 0 ? (
        /* Empty State as explicitly required in prompt */
        <div className="bg-white rounded-3xl border border-[#dce8d6] p-10 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center border border-emerald-100">
            <History className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              No Scan History Recorded Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Whenever you perform a disease detection query, your leaf thumbnail, timestamp, and model predictions will be archived here for longitudinal health tracking.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onNavigateToScan}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              <span>Scan Your First Plant</span>
            </button>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-600">
          No past scans matching "{searchTerm}". Try a different search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const formatted = formatDiseaseLabel(item.topLabel);
            const dateStr = new Date(item.timestamp).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#e2eade] hover:border-emerald-300 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-3">
                  {/* Thumbnail & Timestamp */}
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.topLabel}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {dateStr}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {formatted.condition}
                      </h4>
                      <p className="text-xs text-slate-600 truncate">
                        Crop: <strong className="text-slate-700">{formatted.crop}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-600 font-mono text-[11px] truncate max-w-[140px]">
                      {item.filename}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                        item.topConfidence >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.topConfidence >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.topConfidence}% Conf.
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => onSelectScan(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                  >
                    <span>View Care & Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-700 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
