import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Wheat, Leaf, Bot, FlaskConical, TrendingUp, Landmark } from 'lucide-react';

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    title: 'Smart Wheat Farming',
    subtitle: 'AI-driven crop optimization based on your soil conditions',
    tag: 'Rabi Season',
    tagIcon: <Wheat className="w-3.5 h-3.5" />
  },
  {
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80',
    title: 'Precision Rice Cultivation',
    subtitle: 'Optimize water and fertilizer usage with intelligent guidance',
    tag: 'Kharif Season',
    tagIcon: <Leaf className="w-3.5 h-3.5" />
  },
  {
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80',
    title: 'Modern Agriculture Tech',
    subtitle: 'From drone surveys to soil testing — everything in one platform',
    tag: 'AI Powered',
    tagIcon: <Bot className="w-3.5 h-3.5" />
  },
  {
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80',
    title: 'Fertile Soil Intelligence',
    subtitle: 'Complete N, P, K, pH analysis with actionable recommendations',
    tag: 'Soil Analysis',
    tagIcon: <FlaskConical className="w-3.5 h-3.5" />
  },
  {
    img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80',
    title: 'Mandi Price Prediction',
    subtitle: 'Market trends and MSP-based sell timing recommendations',
    tag: 'Market Insights',
    tagIcon: <TrendingUp className="w-3.5 h-3.5" />
  },
  {
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80',
    title: 'Govt Schemes & Subsidies',
    subtitle: 'From PM Kisan to PMFBY — complete guide to all benefits',
    tag: 'Government',
    tagIcon: <Landmark className="w-3.5 h-3.5" />
  }
];

export default function HeroCarousel({ children }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide Tag */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 transition-all duration-500">
        <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg inline-flex items-center gap-2">
          {slides[current].tagIcon} {slides[current].tag}
        </span>
      </div>

      {/* Content overlay passed from parent */}
      <div className="relative z-10 w-full">{children}</div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-400 rounded-full ${i === current
                ? 'w-8 h-3 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]'
                : 'w-3 h-3 bg-white/40 hover:bg-white/70'
              }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-16 right-6 z-20 text-white/50 font-mono text-sm">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-none"
          style={{
            animation: 'progress 6s linear infinite',
            animationPlayState: animating ? 'paused' : 'running'
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </section>
  );
}
