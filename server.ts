import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client securely on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback hint generator for when API is unavailable or offline
function generateFallbackHint(
  questionTitle: string,
  hintLevel: number,
  language: 'ms' | 'en',
  topic?: string
): { tutorMessage: string; encouragement: string } {
  const isEn = language === 'en';

  if (hintLevel === 1) {
    return {
      tutorMessage: isEn
        ? `Let's read carefully: What information is given in the question, and what are we asked to find? Look at the numbers one by one.`
        : `Jom baca soalan dengan teliti: Apakah maklumat yang diberi dalam soalan, dan apa yang perlu kita cari? Perhatikan nombor yang penting dulu ya!`,
      encouragement: isEn ? 'You got this! Take your time.' : 'Kancil tahu kamu pasti boleh faham!',
    };
  }

  if (hintLevel === 2) {
    return {
      tutorMessage: isEn
        ? `Strategy clue: Decide which operation to use. If things are joined or increased, use addition (+). If comparing or taking away, use subtraction (-). If equal groups, multiply (×) or divide (÷)!`
        : `Petua strategi: Tentukan operasi apa yang sesuai. Kalau bertambah atau digabungkan, kita guna tambah (+). Kalau cari baki atau perbezaan, kita guna tolak (-). Kalau kumpulan sama banyak, darab (×) atau bahagi (÷)!`,
      encouragement: isEn ? 'Step by step, you are almost there!' : 'Langkah demi langkah, makin dekat jawapannya!',
    };
  }

  return {
    tutorMessage: isEn
      ? `Worked step clue: Write down the number sentence clearly. Align digits by place value (ones, tens, hundreds). Double check your calculation!`
      : `Langkah kerja: Tulis ayat matematik dengan kemas. Susun nombor mengikut nilai tempat (sa, puluh, ratus). Jangan lupa semak semula pengiraan kamu!`,
    encouragement: isEn ? 'Fantastic effort! Try testing your answer now.' : 'Usaha yang hebat! Jom cuba semak jawapan kamu sekarang.',
  };
}

// API endpoint for Socratic AI Math Tutor (support both root and base paths)
const tutorHandler = async (req: Request, res: Response) => {
  try {
    const {
      question,
      questionContext,
      topic,
      year,
      hintLevel = 1,
      language = 'ms',
      studentAnswer,
      childName = 'Kawan Pintar',
    } = req.body;

    const isEn = language === 'en';

    if (!aiClient || !process.env.GEMINI_API_KEY) {
      const fallback = generateFallbackHint(question || '', hintLevel, language, topic);
      return res.json({
        success: true,
        source: 'fallback',
        tutorMessage: fallback.tutorMessage,
        encouragement: fallback.encouragement,
      });
    }

    const systemInstruction = `
You are "Kancil Pintar", a beloved, cheerful, friendly cartoon mouse deer mascot tutoring Malaysian primary school students (KSSR standard, primary Year ${year || 3} to 5).
Your tone is warm, polite, encouraging, playful and patient.
CRITICAL PEDAGOGICAL RULES:
1. NEVER directly give away the final numerical answer.
2. Teach Socratically using progressive hints.
3. Keep your response short (2 to 4 sentences max) suitable for 7-12 year old children.
4. Language instruction: ${isEn ? 'Respond in simple, clear, engaging English' : 'Respond in friendly, natural Bahasa Melayu with warm expressions like "Wah", "Jom", "Hebat", "Adik ' + childName + '"'}.
5. Contextualize with relatable Malaysian examples when helpful (e.g. Ringgit Malaysia, duit syiling, durian, kuih karipap, pensel warna).
6. Hint level is ${hintLevel} of 3:
   - Hint Level 1: Gentle observation / clue to understand the question.
   - Hint Level 2: Guide which mathematical concept or operation to apply.
   - Hint Level 3: Break down the first calculation step without revealing the final result.
`;

    const userPrompt = `
Student Name: ${childName}
Grade Level: Tahun / Year ${year || 3}
Topic: ${topic || 'Matematik'}
Math Question: "${question}"
${questionContext ? `Additional Context: ${questionContext}` : ''}
${studentAnswer ? `Student's current input or guess: "${studentAnswer}"` : ''}
Current Hint Level requested: ${hintLevel} (1=clue, 2=strategy, 3=step-by-step breakdown)

Please provide a helpful, encouraging tutoring response according to Hint Level ${hintLevel}.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    const tutorMessage = response.text?.trim() || '';

    if (!tutorMessage) {
      const fallback = generateFallbackHint(question || '', hintLevel, language, topic);
      return res.json({
        success: true,
        source: 'fallback',
        tutorMessage: fallback.tutorMessage,
        encouragement: fallback.encouragement,
      });
    }

    return res.json({
      success: true,
      source: 'gemini',
      tutorMessage,
      encouragement: isEn
        ? `Keep going, ${childName}! You're doing wonderful!`
        : `Teruskan usaha, ${childName}! Kancil bangga dengan kamu!`,
    });
  } catch (error) {
    console.error('Error in /api/tutor:', error);
    const { question, hintLevel = 1, language = 'ms', topic } = req.body;
    const fallback = generateFallbackHint(question || '', hintLevel, language, topic);
    return res.json({
      success: true,
      source: 'fallback',
      tutorMessage: fallback.tutorMessage,
      encouragement: fallback.encouragement,
    });
  }
};

app.post('/api/tutor', tutorHandler);
app.post('/MATHQUESTKIDS-1/api/tutor', tutorHandler);

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Redirect root to base path for dev convenience
    app.get('/', (_req, res) => {
      res.redirect('/MATHQUESTKIDS-1/');
    });
    app.use(vite.middlewares);
  } else {
    app.use('/MATHQUESTKIDS-1', express.static(path.join(__dirname, 'dist')));
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MathQuest Kids server running on port ${PORT}`);
  });
}

startServer();
