import { useState, useRef, useEffect } from 'react';
import { Volume2, Square, Loader2, Pause } from 'lucide-react';
import getPageLanguage, { getSpeechLang } from '../utils/getPageLanguage';
import translateForSpeech from '../utils/translateForSpeech';

/**
 * Premium "Listen" button — speaks AI text in user's chosen website language.
 * Auto-translates English farming terms to Hindi/Marathi/etc.
 * Shows animated sound waves while playing.
 */
export default function SpeakButton({ text, label = 'Listen', size = 'sm' }) {
  const [status, setStatus] = useState('idle'); // idle | loading | playing
  const audioRef = useRef(null);
  const urlRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => stopAll();
  }, []);

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    window.speechSynthesis?.cancel();
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setStatus('idle');
  };

  const handleClick = async () => {
    if (status === 'playing' || status === 'loading') {
      stopAll();
      return;
    }
    if (!text) return;

    try {
      setStatus('loading');
      const controller = new AbortController();
      abortRef.current = controller;

      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const streamUrl = `${apiBase}/tts/speak?text=${encodeURIComponent(text)}`;
      const audio = new Audio(streamUrl);
      audioRef.current = audio;

      audio.onplay = () => setStatus('playing');
      audio.onended = () => { audioRef.current = null; setStatus('idle'); };
      audio.onerror = () => { audioRef.current = null; setStatus('idle'); fallbackSpeak(text); };
      await audio.play();
    } catch {
      setStatus('idle');
      fallbackSpeak(text);
    }
  };

  const fallbackSpeak = (txt) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = txt
      .replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}#*_\[\]()]/gu, '')
      .replace(/\n+/g, '. ');

    const pageLang = getPageLanguage();
    const translated = translateForSpeech(clean, pageLang);

    // Chrome bug fix: split long text into chunks (<200 chars each)
    // Chrome kills speechSynthesis after ~15s on a single utterance
    const splitIntoChunks = (text, maxLen = 180) => {
      const sentences = text.match(/[^.!?।]+[.!?।]?\s*/g) || [text];
      const chunks = [];
      let current = '';
      for (const s of sentences) {
        if ((current + s).length > maxLen && current) {
          chunks.push(current.trim());
          current = s;
        } else {
          current += s;
        }
      }
      if (current.trim()) chunks.push(current.trim());
      return chunks;
    };

    const chunks = splitIntoChunks(translated);
    const voices = window.speechSynthesis.getVoices();
    let bestVoice = voices.find(v => v.lang.startsWith(pageLang));
    if (!bestVoice) bestVoice = voices.find(v => v.lang.includes('IN'));
    if (!bestVoice) bestVoice = voices[0];
    const speechLang = getSpeechLang(pageLang);

    // Chrome keepalive: pause/resume every 10s to prevent timeout
    let keepAliveInterval = null;
    const startKeepAlive = () => {
      keepAliveInterval = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    };
    const stopKeepAlive = () => {
      if (keepAliveInterval) { clearInterval(keepAliveInterval); keepAliveInterval = null; }
    };

    let i = 0;
    const speakNext = () => {
      if (i >= chunks.length) {
        stopKeepAlive();
        setStatus('idle');
        return;
      }
      const utter = new SpeechSynthesisUtterance(chunks[i]);
      utter.rate = 0.95;
      utter.lang = speechLang;
      if (bestVoice) utter.voice = bestVoice;

      utter.onstart = () => setStatus('playing');
      utter.onend = () => { i++; speakNext(); };
      utter.onerror = () => { stopKeepAlive(); setStatus('idle'); };
      window.speechSynthesis.speak(utter);
    };

    startKeepAlive();
    speakNext();
  };

  // ─── RENDER ────────────────────────────────────
  if (status === 'playing') {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs tracking-wider bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all active:scale-95 shadow-sm select-none"
      >
        {/* Animated sound wave bars */}
        <div className="flex items-end gap-[2px] h-4">
          <span className="w-[3px] bg-red-500 rounded-full animate-[soundWave_0.5s_ease-in-out_infinite_alternate]" style={{ height: '40%', animationDelay: '0s' }} />
          <span className="w-[3px] bg-red-500 rounded-full animate-[soundWave_0.5s_ease-in-out_infinite_alternate]" style={{ height: '80%', animationDelay: '0.15s' }} />
          <span className="w-[3px] bg-red-400 rounded-full animate-[soundWave_0.5s_ease-in-out_infinite_alternate]" style={{ height: '60%', animationDelay: '0.3s' }} />
          <span className="w-[3px] bg-red-500 rounded-full animate-[soundWave_0.5s_ease-in-out_infinite_alternate]" style={{ height: '100%', animationDelay: '0.1s' }} />
          <span className="w-[3px] bg-red-400 rounded-full animate-[soundWave_0.5s_ease-in-out_infinite_alternate]" style={{ height: '50%', animationDelay: '0.25s' }} />
        </div>
        <Square className="w-3 h-3 fill-current" />
        <span className="uppercase">Stop</span>
      </button>
    );
  }

  if (status === 'loading') {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-all select-none"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </button>
    );
  }

  // IDLE state — clean, inviting
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-100 transition-all active:scale-95 select-none group"
    >
      <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span className="uppercase">{label}</span>
    </button>
  );
}
