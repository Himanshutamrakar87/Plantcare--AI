export interface PredictionItem {
  label: string;
  confidence: number;
}

export interface PredictResponse {
  filename: string;
  predictions: PredictionItem[];
  note?: string;
}

export interface BackendStatus {
  online: boolean;
  checkedAt: string;
  message: string;
  latencyMs?: number;
  baseUrl: string;
  statusCode?: number;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  imageUrl: string;
  predictions: PredictionItem[];
  topLabel: string;
  topConfidence: number;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: 'en' | 'hi';
}

export interface DiseaseCarePlan {
  crop: string;
  condition: string;
  severity: 'healthy' | 'low' | 'moderate' | 'high';
  summary: string;
  organicRemedies: string[];
  preventiveMeasures: string[];
  wateringAdvice: string;
  soilSunlightTips: string;
  chemicalAdvice?: string;
}
