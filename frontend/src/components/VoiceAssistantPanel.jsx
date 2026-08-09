import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  History,
  Sprout,
  Loader2,
  Maximize2,
  Minimize2,
  Navigation,
  Globe
} from 'lucide-react';
import api from '../services/api';

/**
 * VoiceAssistantPanel - A persistent AI companion for farmers.
 * Features: Speech-to-Text, Text-to-Speech, AI Integration, Navigation, Page Summarization.
 */
export default function VoiceAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', role: 'ai', text: 'Namaste! Main aapka AgriSaar assistant hoon. Main aapki kaise madad kar sakta hoon?' }
  ]);
  const [inputText, setInputText] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Default to Hindi

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
      };
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Extract page content and summarize on page change
  useEffect(() => {
    // Only summarize if the panel was already open
    if (isOpen && !isMinimized) {
      const pageTitle = document.querySelector('h1')?.innerText || 'Is page';
      const summary = `Aap abhi ${pageTitle} par hain. Main is page ki jaankari padh sakta hoon.`;
      // We don't want to be too annoying, so we just log or speak optionally
      console.log("Page change summary:", summary);
    }
  }, [location.pathname]);

  const speak = useCallback((text) => {
    if (isMuted || !synthesisRef.current) return;

    synthesisRef.current.cancel();
    // Clean text from markdown/special chars
    const cleanText = text.replace(/[*_#\[\]()<>]/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Detect Hindi
    const hasHindi = /[\u0900-\u097F]/.test(cleanText);
    utterance.lang = hasHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Select a pleasant voice if available
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang === utterance.lang && v.name.includes('Google')) || 
                          voices.find(v => v.lang === utterance.lang);
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, [isMuted]);

  const stopSpeaking = () => {
    synthesisRef.current.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      stopSpeaking();
      recognitionRef.current?.start();
    }
  };

  const handleSendMessage = async (text = inputText) => {
    const query = text.trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Navigation logic (Quick match)
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('weather') || lowerQuery.includes('mausam') || lowerQuery.includes('मौसम')) {
      navigate('/weather');
    } else if (lowerQuery.includes('soil') || lowerQuery.includes('mitti') || lowerQuery.includes('मिट्टी')) {
      navigate('/soil-input');
    } else if (lowerQuery.includes('crop') || lowerQuery.includes('fasal') || lowerQuery.includes('फसल')) {
      navigate('/crops');
    } else if (lowerQuery.includes('home') || lowerQuery.includes('shuruat') || lowerQuery.includes('होम')) {
      navigate('/');
    }

    try {
      // Get current page context for AI
      const pageInfo = document.querySelector('main')?.innerText?.substring(0, 500) || '';
      
      const response = await api.post('/ai/voice', { 
        transcript: `[Page Context: ${location.pathname}] ${query}` 
      });
      
      const aiText = response.data?.advice || response.advice || "Maaf kijiye, main samajh nahi paaya.";
      
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText };
      setMessages(prev => [...prev, aiMsg]);
      speak(aiText);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMsg = { id: Date.now().toString(), role: 'ai', text: "Server se sampark nahi ho pa raha hai. Kripya baad mein prayas karein." };
      setMessages(prev => [...prev, errorMsg]);
      speak(errorMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, originX: 1, originY: 1 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '500px',
              width: isMinimized ? '300px' : '380px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-emerald-100 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center justify-between transition-all duration-300 ${isMinimized ? 'h-full' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-emerald-600 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">AgriSaar Sahayak</h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-50">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => { setIsOpen(false); stopSpeaking(); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-md' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm font-medium'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Soch raha hoon...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Bar (Speaking) */}
                {isSpeaking && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="bg-emerald-50 border-t border-emerald-100 px-4 py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <Volume2 className="w-4 h-4 animate-bounce" /> Bol raha hoon...
                    </div>
                    <button 
                      onClick={stopSpeaking}
                      className="text-[10px] bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-bold hover:bg-emerald-300 transition-colors"
                    >
                      STOP
                    </button>
                  </motion.div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Kuch puchein..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-medium pr-10"
                      />
                      <button 
                        onClick={toggleListening}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                          isListening 
                            ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse' 
                            : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isLoading}
                      className={`p-2.5 rounded-xl transition-all ${
                        inputText.trim() && !isLoading
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Quick Commands */}
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { icon: <Navigation className="w-3 h-3" />, label: 'Weather', cmd: 'Mausam dikhao' },
                      { icon: <Globe className="w-3 h-3" />, label: 'Soil Health', cmd: 'Mitti ki jaanch' },
                      { icon: <History className="w-3 h-3" />, label: 'Crops', cmd: 'Fasal ki jaankari' },
                    ].map((btn, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSendMessage(btn.cmd)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 border-2 border-white/20 relative group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="icon"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-8 h-8" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full border-2 border-emerald-600"></div>
            </motion.div>
          ) : (
            <motion.div
              key="chevron"
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </motion.button>
    </div>
  );
}
