import { PredictResponse, BackendStatus, PredictionItem } from '../types';

const STORAGE_KEY_API_URL = 'plantcare_api_base_url';
const STORAGE_KEY_CHAT_URL = 'plantcare_chat_api_url';

export const DEFAULT_API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000';

export const DEFAULT_CHAT_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CHAT_API_URL) ||
  '/api/chat';

/**
 * Returns the currently active FastAPI base URL.
 */
export function getBackendBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_API_URL);
    if (saved) return saved.trim().replace(/\/+$/, '');
  }
  return DEFAULT_API_BASE_URL.replace(/\/+$/, '');
}

/**
 * Saves a custom FastAPI base URL to local storage.
 */
export function setBackendBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEY_API_URL, cleanUrl);
  }
}

/**
 * Resets FastAPI URL to the environment default.
 */
export function resetBackendBaseUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_API_URL);
  }
}

/**
 * Gets Chat API endpoint URL
 */
export function getChatApiUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_CHAT_URL);
    if (saved) return saved.trim();
  }
  return DEFAULT_CHAT_API_URL;
}

export function setChatApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CHAT_URL, url.trim());
  }
}

/**
 * Checks connection status of the Python FastAPI backend using GET /
 */
export async function checkBackendStatus(targetUrl?: string): Promise<BackendStatus> {
  const baseUrl = targetUrl ? targetUrl.replace(/\/+$/, '') : getBackendBaseUrl();
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${baseUrl}/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      let bodyText = '';
      try {
        const json = await response.json();
        bodyText = json.message || json.status || JSON.stringify(json);
      } catch {
        bodyText = await response.text();
      }

      return {
        online: true,
        checkedAt: new Date().toISOString(),
        message: bodyText || 'FastAPI backend is responsive and operational.',
        latencyMs,
        baseUrl,
        statusCode: response.status,
      };
    } else {
      return {
        online: false,
        checkedAt: new Date().toISOString(),
        message: `Backend returned HTTP ${response.status}: ${response.statusText}`,
        latencyMs,
        baseUrl,
        statusCode: response.status,
      };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    let errorDetail = 'FastAPI server not responding.';
    if (err.name === 'AbortError') {
      errorDetail = 'Connection timed out after 6 seconds.';
    } else if (err.message && err.message.includes('Failed to fetch')) {
      errorDetail =
        'Network error or CORS blocked. Ensure FastAPI is running and CORSMiddleware allows origins.';
    } else if (err.message) {
      errorDetail = err.message;
    }

    return {
      online: false,
      checkedAt: new Date().toISOString(),
      message: errorDetail,
      latencyMs,
      baseUrl,
    };
  }
}

/**
 * Submits leaf image to FastAPI POST /predict endpoint
 */
export async function predictPlantDisease(file: File): Promise<PredictResponse> {
  // Validate file before submission
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !validExtensions.includes(ext)) {
    throw new Error(
      `Unsupported file format (${ext || 'unknown'}). Please upload a JPG, JPEG, PNG, or WEBP image.`
    );
  }

  // 15 MB max threshold
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Image size exceeds 15 MB limit. Please compress or select a smaller image.');
  }

  const baseUrl = getBackendBaseUrl();
  const formData = new FormData();
  formData.append('file', file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errMsg = `Server returned status ${response.status} (${response.statusText})`;
      try {
        const errJson = await response.json();
        if (errJson.detail) errMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        else if (errJson.message) errMsg = errJson.message;
      } catch {
        // Fallback to status text
      }
      throw new Error(errMsg);
    }

    const data = await response.json();

    // Verify response structure
    if (!data || !Array.isArray(data.predictions)) {
      throw new Error(
        'Invalid response structure received from backend. Expected a JSON object with a "predictions" array.'
      );
    }

    // Normalize confidence values to percentages (0 - 100%)
    const normalizedPredictions: PredictionItem[] = data.predictions.map((p: any) => {
      let conf = Number(p.confidence);
      if (isNaN(conf)) conf = 0;
      // If decimal <= 1, convert to percentage e.g. 0.94 -> 94.0%
      if (conf <= 1 && conf > 0) {
        conf = conf * 100;
      }
      return {
        label: String(p.label || 'Unknown Condition'),
        confidence: Number(conf.toFixed(1)),
      };
    });

    // Sort descending by confidence
    normalizedPredictions.sort((a, b) => b.confidence - a.confidence);

    return {
      filename: data.filename || file.name,
      predictions: normalizedPredictions,
      note: data.note || undefined,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Prediction request timed out after 20 seconds. Please check your FastAPI model server.');
    }
    if (err.message && err.message.includes('Failed to fetch')) {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isLocalHttp = baseUrl.startsWith('http://localhost') || baseUrl.startsWith('http://127.0.0.1');
      if (isHttps && isLocalHttp) {
        throw new Error(
          `Unable to reach local FastAPI backend at ${baseUrl}/predict from the HTTPS preview. Web browsers block HTTPS pages from accessing HTTP localhost directly (Mixed Content). To connect your local FastAPI server, run this app locally at http://localhost:3000, or provide an HTTPS URL (such as a Hugging Face Space or ngrok tunnel) in API Settings.`
        );
      }
      throw new Error(
        `Unable to reach FastAPI backend at ${baseUrl}/predict. Please ensure your Python server is running (e.g. 'uvicorn main:app --reload --port 8000') and CORS is enabled.`
      );
    }
    throw err;
  }
}

/**
 * Sends inquiry to the AI Plant Assistant Chatbot backend
 */
export async function sendChatMessage(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; text: string }>,
  language: 'en' | 'hi',
  plantContext?: string
): Promise<{ reply: string; language: string }> {
  const chatUrl = getChatApiUrl();

  const formattedHistory = history.map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    text: h.text,
  }));

  try {
    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        language,
        plantContext,
      }),
    });

    if (!response.ok) {
      let errMsg = `Chat server error (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson.error) errMsg = errJson.error;
      } catch {
        // use default
      }
      throw new Error(errMsg);
    }

    const data = await response.json();
    return {
      reply: data.reply || 'No response generated.',
      language: data.language || language,
    };
  } catch (err: any) {
    console.error('Chat error:', err);
    throw err;
  }
}
