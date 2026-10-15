import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PlantCare AI Backend Gateway',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Gemini AI Chatbot endpoint for PlantCare advisory
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'en', plantContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Gemini API key is not configured on the server. Add GEMINI_API_KEY to your environment or secrets to enable live AI responses.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(message);

    const systemInstruction = `You are "PlantCare AI Assistant", a friendly, certified plant agronomist and crop pathologist.
Your goal is to help gardeners, farmers, and plant enthusiasts keep their crops and houseplants thriving.
Guidelines:
- Provide practical, scientifically sound plant care recommendations (watering, soil pH, sunlight, organic treatments, preventive measures).
- If the user provides a diagnosed plant condition (Context: ${plantContext || 'None specified'}), give tailored remedies (organic first, IPM - integrated pest management, followed by chemical if severe).
- Always include a brief reminder that field verification with agricultural extension specialists is recommended for widespread crop infections.
- ${isHindi ? 'Respond in fluent, warm, and natural Hindi (Devanagari script), using relatable terms for farmers and gardeners.' : 'Respond in clear, structured, encouraging English with bullet points and bold headers where appropriate.'}
- Keep answers actionable, concise, and easy to read on mobile screens.`;

    // Construct conversation history for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Include recent history if provided (max 6 previous turns)
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'model') {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }

    // Append current prompt with any active plant diagnostic context
    let promptWithContext = message;
    if (plantContext && contents.length === 0) {
      promptWithContext = `[Current Plant Scan Context: ${plantContext}]\n\nUser Question: ${message}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: promptWithContext }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || 'I could not generate a response. Please try again.';
    res.json({ reply, language: isHindi ? 'hi' : 'en' });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({
      error: err?.message || 'Failed to process plant assistant inquiry.',
    });
  }
});

// Setup dev server with Vite or production static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlantCare AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
