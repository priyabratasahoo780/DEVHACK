import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Loader2, X, MessageSquare, Volume2, VolumeX, Send, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import VoiceInput from './VoiceInput';

export default function KisaanAIAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  const [prefLang, setPrefLang] = useState('Hindi');
  const { locationText } = useLocation();
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);
  const currentAudioUrl = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, loading]);

  // Cleanup audio URLs on unmount
  useEffect(() => {
    return () => {
      if (currentAudioUrl.current) URL.revokeObjectURL(currentAudioUrl.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const addMessage = (role, text) => {
    setConversation(prev => [...prev, { role, text }]);
  };

  const handleUserMessage = async (query) => {
    if (!query.trim()) return;

    addMessage('user', query);
    setInputText('');
    setLoading(true);

    try {
      const contextQuery = `[Reply in: ${prefLang}] ${locationText ? `[Location: ${locationText}] ` : ''}${query}`;
      const res = await api.post('/ai/voice', { transcript: contextQuery });
      const payload = res.data || res;
      const reply = payload.advice || (typeof payload === 'string' ? payload : JSON.stringify(payload));

      addMessage('ai', reply);
      // Auto-speak the response with ElevenLabs
      speakWithElevenLabs(reply);
    } catch (err) {
      const fallback = "I couldn't understand that. Please try again in a moment.";
      addMessage('ai', fallback);
    } finally {
      setLoading(false);
    }
  };

  const speakWithElevenLabs = async (text) => {
    try {
      // Stop any current audio
      stopSpeaking();
      setLoadingVoice(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const streamUrl = `${apiBase}/tts/speak?text=${encodeURIComponent(text)}`;
      const audio = new Audio(streamUrl);
      audioRef.current = audio;

      audio.onplay = () => { setSpeaking(true); setLoadingVoice(false); };
      audio.onended = () => {
        setSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        console.error('TTS streaming failed');
        setSpeaking(false);
        setLoadingVoice(false);
        audioRef.current = null;
        fallbackSpeak(text);
      };

      await audio.play();
    } catch (err) {
      console.error('Assistant voice error:', err);
      setLoadingVoice(false);
      fallbackSpeak(text);
    }
  };

  // Browser fallback if ElevenLabs fails
  const fallbackSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}#*_\[\]()]/gu, '').replace(/\n+/g, '. ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      const hasHindi = /[\u0900-\u097F]/.test(cleanText);
      utterance.lang = hasHindi ? 'hi-IN' : 'en-IN';

      const voices = window.speechSynthesis.getVoices();
      // Try specifically for Microsoft Kalpana (Hindi female) or Zira (English female)
      const femaleVoice = voices.find(v => (v.lang === utterance.lang && (v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('female'))));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setLoadingVoice(false);
  };

  const formatAiMessage = (text) => {
    return text.split('\n').map((line, i) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-gray-900">$1</strong>');
      return (
        <span key={i} className="block mb-1 font-medium" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-primary-100 overflow-hidden flex flex-col animate-fade-in origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative">
                <MessageSquare className="w-5 h-5 text-white" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-800"></div>
              </div>
              <div>
                <h3 className="text-white font-extrabold text-sm">Kisaan AI Assistant</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-primary-200 text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {locationText ? locationText.split(',')[0] : 'Online'}
                  </p>
                  <select
                    value={prefLang}
                    onChange={(e) => setPrefLang(e.target.value)}
                    className="bg-white/20 text-white text-[10px] rounded px-1 py-0.5 outline-none font-bold border border-white/20"
                  >
                    <option value="Hindi" className="text-gray-900">हिंदी</option>
                    <option value="English" className="text-gray-900">English</option>
                    <option value="Gujarati" className="text-gray-900">ગુજરાતી</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); stopSpeaking(); }} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-primary-100 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#f8fbf8]" style={{ scrollbarWidth: 'thin' }}>
            {conversation.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3 text-primary-700">
                  <SproutIcon className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-700">Ask your question...</p>
                <p className="text-xs text-gray-500 mt-1">About weather, crops, or market prices</p>
                <p className="text-[10px] text-primary-600 mt-2 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Voice replies powered by ElevenLabs
                </p>
              </div>
            ) : (
              conversation.map((msg, i) => (
                <div key={i} className={`max-w-[85%] ${msg.role === 'user'
                    ? 'ml-auto bg-primary-800 text-white rounded-2xl rounded-tr-sm p-3 shadow-md'
                    : 'mr-auto bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm p-3.5 shadow-sm'
                  }`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium">{msg.text}</p>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-700">{formatAiMessage(msg.text)}</div>
                      {/* Play voice button on AI messages */}
                      <button
                        onClick={() => speakWithElevenLabs(msg.text)}
                        disabled={loadingVoice}
                        className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-full"
                      >
                        {loadingVoice ? (
                          <><Loader2 className="w-3 h-3 animate-spin" /> Loading voice...</>
                        ) : speaking ? (
                          <><VolumeX className="w-3 h-3" /> Stop</>
                        ) : (
                          <><Volume2 className="w-3 h-3" /> Play Voice</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="mr-auto bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                <span className="text-xs font-bold text-primary-700">Thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Speaking Indicator */}
          {(speaking || loadingVoice) && (
            <div className="bg-gradient-to-r from-primary-50 to-green-50 border-y border-primary-100 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-primary-700">
                {loadingVoice ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating voice...</>
                ) : (
                  <>
                    <div className="flex items-center gap-0.5">
                      <span className="inline-block w-1 h-3 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="inline-block w-1 h-4 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="inline-block w-1 h-2.5 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      <span className="inline-block w-1 h-3.5 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                      <span className="inline-block w-1 h-2 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                    </div>
                    AI is speaking...
                  </>
                )}
              </div>
              <button onClick={stopSpeaking} className="text-[10px] bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-bold hover:bg-red-200 transition-colors active:scale-95">
                Stop
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1 pl-4 pr-1 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(inputText)}
                placeholder="Type or speak..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
              />

              <VoiceInput
                onTranscript={(text) => setInputText((prev) => prev + ' ' + text)}
                className="w-10 h-10"
              />

              <button
                onClick={() => handleUserMessage(inputText)}
                disabled={!inputText.trim() || loading}
                className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center transition-all ${inputText.trim() && !loading ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700' : 'bg-gray-100 text-gray-400'
                  }`}
              >
                <div className={inputText.trim() && !loading ? 'rotate-[-45deg] mr-[-2px] mt-[2px]' : ''}>
                  <Send className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            if (!user) {
              toast.error('Bhaiya, AI Assistant ke liye pehle Login karein! 🙏');
              navigate('/login');
              return;
            }
            setIsOpen(true);
          }}
          className="group relative flex items-center"
        >
          <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-primary-100 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap hidden sm:block">
            <p className="text-sm font-extrabold text-gray-800">Hello, I'm Kisaan AI!</p>
            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white border-r border-t border-primary-100 transform -translate-y-1/2 rotate-45"></div>
          </div>

          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary-600/50 hover:scale-110 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-primary-200 relative">
            <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-20"></div>
            <MessageSquare className="w-8 h-8" />
          </div>
        </button>
      )}
    </div>
  );
}

// Inline pure icon
function SproutIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.1-1.9-2.3-3.3.6.1 1.2.2 1.8.2 1.1 0 2.2-.3 3-1z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}
