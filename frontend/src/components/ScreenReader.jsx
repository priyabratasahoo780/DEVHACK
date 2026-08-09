import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

export default function ScreenReader({ textToRead }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      
      // Load voices to ensure Hindi is available
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
        setLoading(false);
      };
      
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setLoading(false);
    }

    return () => {
      window.speechSynthesis?.cancel(); // cleanup on unmount
    };
  }, []);

  const toggleReading = () => {
    if (!supported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Find a suitable Hindi voice or fallback to default
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi')) || voices[0];

      const utterance = new SpeechSynthesisUtterance(textToRead);
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.cancel(); // Stop any previous speech
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggleReading}
      disabled={loading || !textToRead}
      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-sm border ${
        isPlaying
          ? 'bg-primary-600 text-white border-primary-700 animate-pulse'
          : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-50'
      }`}
      title="Sunein (Text to Speech)"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isPlaying ? (
        <><VolumeX className="w-5 h-5" /> Rokiye</>
      ) : (
        <><Volume2 className="w-5 h-5" /> Padh kar Sunein</>
      )}
    </button>
  );
}
