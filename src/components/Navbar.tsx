import React, { useState } from 'react';
import {
  Sprout,
  Activity,
  MessageSquareText,
  ShieldCheck,
  History,
  Settings2,
  Menu,
  X,
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { BackendStatus } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'detect' | 'chat' | 'care' | 'history';
  setActiveTab: (tab: 'home' | 'detect' | 'chat' | 'care' | 'history') => void;
  backendStatus: BackendStatus;
  onRefreshBackend: () => void;
  onOpenBackendSettings: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  backendStatus,
  onRefreshBackend,
  onOpenBackendSettings,
  historyCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home' as const, label: 'Home', icon: Sprout },
    { id: 'detect' as const, label: 'Disease Detection', icon: Activity },
    { id: 'chat' as const, label: 'AI Plant Assistant', icon: MessageSquareText },
    { id: 'care' as const, label: 'Smart Care', icon: ShieldCheck },
    {
      id: 'history' as const,
      label: 'Scan History',
      icon: History,
      badge: historyCount > 0 ? historyCount : undefined,
    },
  ];

  const handleNavClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5ebe0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  PlantCare <span className="text-emerald-700">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  AgriTech
                </span>
              </div>
              <p className="text-xs text-slate-600 hidden sm:block">
                Smart Plant Disease Detection & Care
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Backend Status Indicator & Config Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenBackendSettings}
              title={`FastAPI Backend: ${
                backendStatus.online ? 'Online' : 'Disconnected'
              } (${backendStatus.baseUrl})`}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                backendStatus.online
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/70'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100/70'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus.online ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                />
                {backendStatus.online && (
                  <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                )}
              </div>
              <div className="text-left hidden lg:block">
                <span className="font-semibold block leading-tight">
                  {backendStatus.online ? 'FastAPI Connected' : 'FastAPI Disconnected'}
                </span>
                <span className="text-[10px] text-slate-600 truncate max-w-[120px] block">
                  {backendStatus.baseUrl.replace(/^https?:\/\//, '')}
                </span>
              </div>
              <span className="lg:hidden font-semibold">
                {backendStatus.online ? 'API Online' : 'API Offline'}
              </span>
              <Settings2 className="w-3.5 h-3.5 text-slate-600 ml-1" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e5ebe0] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              API Base: {backendStatus.baseUrl}
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBackendSettings();
              }}
              className="text-xs text-emerald-800 font-semibold underline flex items-center gap-1"
            >
              <Settings2 className="w-3 h-3" /> Config
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
