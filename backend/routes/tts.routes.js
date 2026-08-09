import { Router } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

// ElevenLabs TTS - Changing to "Ayesha" (fG9s0SXJb213f4UxVHyG) natively Indian Female
const VOICE_ID = 'fG9s0SXJb213f4UxVHyG'; // Ayesha - Distinct Indian Female voice

router.get('/speak', async (req, res) => {
  try {
    const { text } = req.query;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'ElevenLabs API key not configured' });
    }

    // Clean text: remove emojis, markdown bold, extra newlines
    const cleanText = text
      .replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[#*_\[\]()]/g, '')
      .replace(/\n+/g, '. ')
      .trim()
      .substring(0, 2500); // ElevenLabs has char limits

    if (!cleanText) {
      return res.status(400).json({ success: false, message: 'No speakable text' });
    }

    logger.info(`TTS Request: ${cleanText.substring(0, 80)}...`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=4`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey, 
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_turbo_v2_5', // Extremely fast model, natively supports Hindi with Indian accents
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.4,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error(`ElevenLabs Error ${response.status}: ${errText}`);
      return res.status(response.status).json({ 
        success: false, 
        message: `ElevenLabs API error: ${response.status}` 
      });
    }

    // Stream audio back as mp3
    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    });

    // Pipe the ElevenLabs response stream directly to client
    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    await pump();

  } catch (error) {
    logger.error(`Gemini voice error: ${error.message}`);
    return res.status(500).json({ success: false, message: `Maafi chaahte hain, AI thoda bheegee hai (API connection issue). Kripya thodi der baad koshish karein.` });
  }
});

export default router;
