import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Globe2,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Leaf,
  Layers,
  HelpCircle,
  X,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';

interface ChatbotProps {
  activePlantContext?: string | null;
  onClearContext?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  activePlantContext,
  onClearContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hello! I am your PlantCare AI Agronomist. How can I help you care for your crops or houseplants today? You can ask me questions in English or हिंदी (Hindi).",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'en',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions from user requirements
  const suggestedQuestions = [
    { en: 'How often should I water my tomato plant?', hi: 'टमाटर के पौधे को कितना पानी देना चाहिए?' },
    { en: 'How can I prevent leaf diseases?', hi: 'पत्तियों के रोगों को कैसे रोका जा सकता है?' },
    { en: 'How much sunlight does my plant need?', hi: 'मेरे पौधे को कितनी धूप की आवश्यकता होती है?' },
    { en: 'How to make organic neem oil spray?', hi: 'घर पर जैविक नीम स्प्रे कैसे बनाएं?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        text,
        messages.map((m) => ({ role: m.role, text: m.text })),
        selectedLanguage,
        activePlantContext || undefined
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: (response.language as 'en' | 'hi') || selectedLanguage,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(
        err.message ||
          'Could not reach AI plant assistant. Please check your network connection or verify that GEMINI_API_KEY is configured on the backend.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#dce6d6] shadow-sm flex flex-col h-[700px] max-h-[82vh] overflow-hidden">
      {/* Chatbot Header */}
      <div className="px-5 py-4 border-b border-[#e5ebe0] bg-[#f9faf7] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                AI Plant Doctor & Agronomist
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Crop diseases, watering schedules, organic pest control & soil nutrition
            </p>
          </div>
        </div>

        {/* Language Selector: English / Hindi */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <Globe2 className="w-3.5 h-3.5 text-slate-600 ml-1.5" />
          <button
            onClick={() => setSelectedLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedLanguage === 'en'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedLanguage === 'hi'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Active Diagnosis Context Banner if available */}
      {activePlantContext && (
        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2 truncate">
            <Leaf className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium">Active Scan Context:</span>
            <strong className="truncate font-semibold">{activePlantContext}</strong>
          </div>
          {onClearContext && (
            <button
              onClick={onClearContext}
              className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
              title="Remove context"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fcfdfa]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Leaf className="w-4 h-4 text-emerald-700" />}
              </div>

              {/* Chat Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-800 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white border border-[#e2eade] text-slate-800 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Formatted Message Text */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Footer with time and copy button */}
                <div
                  className={`mt-1.5 flex items-center justify-between gap-3 text-[10px] ${
                    isUser ? 'text-emerald-200' : 'text-slate-600'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-800 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-emerald-700 animate-pulse" />
            </div>
            <div className="bg-white border border-[#e2eade] rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>Consulting Gemini agronomist...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips (As requested in prompt) */}
      <div className="px-4 py-2 border-t border-[#edf2ea] bg-white overflow-x-auto">
        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 shrink-0">
            <HelpCircle className="w-3 h-3 text-emerald-700" />
            Suggested:
          </span>
          {suggestedQuestions.map((sq, idx) => {
            const label = selectedLanguage === 'hi' ? sq.hi : sq.en;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(label)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs transition-colors shrink-0 cursor-pointer"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Input Footer */}
      <div className="p-3 sm:p-4 border-t border-[#e5ebe0] bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedLanguage === 'hi'
                ? 'अपने पौधे के बारे में कोई भी प्रश्न पूछें (उदा. पत्तियों के रोग कैसे ठीक करें)...'
                : 'Ask a plant care question (e.g. How to prevent tomato leaf mold)...'
            }
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-xs sm:text-sm text-slate-900 bg-white shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className={`p-2.5 sm:p-3 rounded-xl font-semibold text-white shadow-xs transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              isLoading || !inputValue.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 shadow-md'
            }`}
            title="Send inquiry"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">
          PlantCare AI Chat calls the backend endpoint securely. Never exposes API keys on the frontend.
        </p>
      </div>
    </div>
  );
};
