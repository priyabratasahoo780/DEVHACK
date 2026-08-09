import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VoiceInput({ onTranscript, placeholder = 'Bol kar bataein...', className = '' }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Helper to get selected language from cookie, map it to BCP-47 Speech API codes
  const getSpeechLang = () => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    const lang = match ? match[1] : 'en'; // default
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN'
    };
    return langMap[lang] || 'hi-IN'; // Fallback to Hindi if not mapped, or en-US
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech API not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.success('Listening... please speak now');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onTranscript) {
        onTranscript(transcript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast.error('Awaaz samajh nahi aayi, phir try karein');
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Gareeb, aapka browser bolne wala feature support nahi karta!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Refresh language right before starting
      recognitionRef.current.lang = getSpeechLang();
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Already started");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-300 w-12 h-12 flex-shrink-0 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
          : 'bg-green-100 hover:bg-green-200 text-green-700 shadow-sm'
      } ${className}`}
      title={placeholder}
    >
      {isListening ? (
        <>
          <span className="absolute inset-0 rounded-xl border-2 border-red-500 animate-ping opacity-75"></span>
          <Loader2 className="w-5 h-5 animate-spin absolute" style={{ opacity: 0.2 }} />
          <Mic className="w-6 h-6 animate-bounce" />
        </>
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
}
