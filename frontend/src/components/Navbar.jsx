import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, FlaskConical, Wheat, BarChart3, Landmark, Home as HomeIcon, HeartHandshake, Trees, Store, Droplet, Globe, ChevronDown, User, Settings, LogOut, Moon, Sun, Award, ChevronRight, CalendarDays, Bell, ScanLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const navLinks = [
  { path: '/', label: 'Home', Icon: HomeIcon },
  { path: '/soil-input', label: 'Soil', Icon: FlaskConical },
  { path: '/crops', label: 'Crops', Icon: Wheat },
  { path: '/disease', label: 'Disease', Icon: ScanLine },
  { path: '/weather', label: 'Weather', Icon: Sun },
  { path: '/market', label: 'Market', Icon: BarChart3 },
  { path: '/bio-inputs', label: 'Bio-Fertilizer', Icon: Droplet },
  { path: '/agroforestry', label: 'Profit Trees', Icon: Trees },
  { path: '/schemes', label: 'Schemes', Icon: Landmark }
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
];

const navItemStyles = `
  .nav-link {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, box-shadow 0.2s ease;
  }

  /* Ripple circle */
  .nav-link .ripple-circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(22,163,74,0.35) 0%, rgba(22,163,74,0.08) 50%, transparent 70%);
    transform: scale(0);
    pointer-events: none;
    z-index: 0;
  }
  .nav-link .ripple-circle.animate {
    animation: rippleExpand 0.6s ease-out forwards;
  }

  @keyframes rippleExpand {
    0%   { transform: scale(0); opacity: 1; }
    70%  { opacity: 0.5; }
    100% { transform: scale(2.5); opacity: 0; }
  }

  /* Spring press */
  .nav-link.pressing {
    transform: scale(0.92);
    transition: transform 0.1s ease-in;
  }
  .nav-link.releasing {
    transform: scale(1);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Hover glow */
  .nav-link:hover {
    box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
  }

  /* Icon bounce on click */
  .nav-link.pressing .nav-icon {
    transform: scale(0.85) rotate(-8deg);
    transition: transform 0.1s ease-in;
  }
  .nav-link.releasing .nav-icon {
    transform: scale(1.15) rotate(0deg);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nav-link > * {
    position: relative;
    z-index: 1;
  }

  /* Active indicator bar */
  .nav-link-active-bar {
    position: absolute;
    left: 15%;
    right: 15%;
    bottom: -2px;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: linear-gradient(90deg, #2e7d32, #66bb6a, #2e7d32);
    background-size: 200% 100%;
    animation: shimmerBar 2s ease-in-out infinite;
    box-shadow: 0 -2px 12px rgba(22,163,74,0.5);
  }

  @keyframes shimmerBar {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
`;

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const mockUser = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kisan User',
    email: user?.email || 'kisan@agrisaar.com',
    avatar: (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'K').toUpperCase(),
    coins: 2450
  };



  return (
    <div className="relative" ref={menuRef}>
      {!user ? (
        <Link
          to="/login"
          className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-all shadow-md active:scale-95 group"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wide">Login / Join</span>
        </Link>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
              {mockUser.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider leading-none mb-0.5">My Profile</p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{mockUser.name}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/5 dark:bg-black/20" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Header / Identity */}
                <div className="p-5 bg-gradient-to-br from-primary-50 to-emerald-50/30 dark:from-primary-900/10 dark:to-emerald-900/5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-lg shadow-sm border border-primary-100 dark:border-primary-900/30">
                      {mockUser.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white leading-none">{mockUser.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mt-1">{mockUser.email}</p>
                    </div>
                  </div>

                  {/* AgriCoins Section */}
                  <div className="bg-primary-600 rounded-2xl p-3 text-white shadow-lg shadow-primary-600/20 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl group-hover:rotate-12 transition-transform"><Award className="w-5 h-5" /></span>
                      <div>
                        <p className="text-[10px] font-black text-primary-100 uppercase tracking-widest leading-none">AgriCoins</p>
                        <p className="text-sm font-black mt-0.5">{mockUser.coins.toLocaleString()}</p>
                      </div>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors">
                      REDEEM
                    </button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <Award className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      </div>
                      <span className="text-sm font-bold">My Growth Chart</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>

                  <div
                    onClick={toggleTheme}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                        {theme === 'dark' ? (
                          <Sun className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <Moon className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <span className="text-sm font-bold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 transition-colors group"
                  >
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg group-hover:bg-red-100 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ── Standalone Language Selector ── */
function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const getCurrentCode = () => {
    return localStorage.getItem('agrisaar_language') || 'en';
  };

  const getCurrentLangLabel = () => {
    const code = getCurrentCode();
    return languages.find(l => l.code === code)?.label?.split(' ')[0] || 'English';
  };

  const changeLanguage = (langCode) => {
    // 1. Save preference to localStorage (primary source of truth)
    localStorage.setItem('agrisaar_language', langCode);

    // 2. Set cookie on all possible domains for Google Translate
    const pathValue = langCode === 'en' ? '/en/en' : `/en/${langCode}`;
    document.cookie = `googtrans=${pathValue}; path=/;`;
    document.cookie = `googtrans=${pathValue}; path=/; domain=${window.location.hostname}`;
    // Handle Vercel subdomains
    const parts = window.location.hostname.split('.');
    if (parts.length > 2) {
      const parentDomain = parts.slice(-2).join('.');
      document.cookie = `googtrans=${pathValue}; path=/; domain=.${parentDomain}`;
    }

    // 3. Reload to apply translation
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 px-3 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all active:scale-95 border border-blue-100 dark:border-blue-800/30 group"
      >
        <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        <span className="text-[11px] font-black uppercase tracking-wider hidden sm:inline">{getCurrentLangLabel()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Select Language</span>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1.5">
              {languages.map((lang) => {
                const active = getCurrentCode() === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-0.5 flex items-center justify-between
                      ${active
                        ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {lang.label}
                    {active && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
/* ── Nav Link with real ripple + spring press ── */
function NavItem({ path, label, Icon, isActive }) {
  const linkRef = useRef(null);

  const spawnRipple = useCallback((e) => {
    const el = linkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple-circle animate';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.appendChild(ripple);

    // Remove after animation
    ripple.addEventListener('animationend', () => ripple.remove());

    // Spring press class
    el.classList.remove('releasing');
    el.classList.add('pressing');
  }, []);

  const releasePress = useCallback(() => {
    const el = linkRef.current;
    if (!el) return;
    el.classList.remove('pressing');
    el.classList.add('releasing');
  }, []);

  return (
    <Link
      ref={linkRef}
      to={path}
      onPointerDown={spawnRipple}
      onPointerUp={releasePress}
      onPointerLeave={releasePress}
      className={`nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap select-none cursor-pointer
        ${isActive
          ? 'text-primary-700 bg-primary-50 shadow-sm'
          : 'text-gray-500 hover:text-primary-700 hover:bg-primary-50/60'
        }`}
    >
      <Icon
        className={`nav-icon w-4 h-4 shrink-0
          ${isActive
            ? 'text-primary-600'
            : 'text-gray-400'
          }`}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span>{label}</span>
      {isActive && <span className="nav-link-active-bar" />}
    </Link>
  );
}


function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const menuRef = useRef(null);

  // Generate dynamic notifications based on current time/date
  const hour = new Date().getHours();
  const month = new Date().getMonth() + 1;
  const isRabi = month >= 10 || month <= 3;
  const isKharif = month >= 6 && month <= 10;

  const notifications = [
    {
      id: 1,
      icon: '🌧️',
      iconBg: 'bg-blue-100',
      title: 'Weather Alert',
      message: hour < 12
        ? 'Morning advisory: Check weather forecast before irrigation. UV index is moderate today.'
        : 'Evening advisory: Temperature dropping tonight. Protect seedlings with mulching if below 10°C.',
      time: '15 mins ago',
      unread: true
    },
    {
      id: 2,
      icon: '📈',
      iconBg: 'bg-green-100',
      title: 'Market Price Update',
      message: 'Wheat prices increased by ₹45/quintal in Agmarknet today. Current rate: ₹2,320/q. Consider selling if above MSP.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      icon: '🏛️',
      iconBg: 'bg-purple-100',
      title: 'New Scheme Available',
      message: 'PM-KISAN 17th installment of ₹6,000/year is being credited. Check your bank account status.',
      time: '3 hours ago',
      unread: true
    },
    {
      id: 4,
      icon: '🌾',
      iconBg: 'bg-amber-100',
      title: 'Farming Tip',
      message: isRabi
        ? 'Rabi season tip: Apply first irrigation to wheat at 21 days (crown root stage) for best tillering.'
        : 'Kharif tip: Monitor for Fall Armyworm in maize. Early detection saves 30% crop loss.',
      time: '5 hours ago',
      unread: false
    },
    {
      id: 5,
      icon: '🧪',
      iconBg: 'bg-cyan-100',
      title: 'Soil Health Reminder',
      message: 'Your last soil test was 60+ days ago. Re-test soil before next sowing for accurate fertilizer recommendations.',
      time: 'Yesterday',
      unread: false
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); setUnread(0); }}
        className="relative p-2.5 rounded-full bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition-all active:scale-95 group border border-transparent hover:border-primary-100"
      >
        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
            <span className="text-[9px] font-black text-white">{unread}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-[360px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-white">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary-600" />
                <h3 className="font-black text-gray-900">Notifications</h3>
              </div>
              <button className="text-[10px] font-bold text-primary-600 uppercase tracking-wider hover:underline">Mark all read</button>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-blue-50/20' : ''}`}>
                  <div className="flex gap-3 items-start">
                    <div className={`w-9 h-9 rounded-xl ${n.iconBg} flex items-center justify-center text-sm flex-shrink-0`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                        <span className="text-[10px] font-bold text-gray-400 flex-shrink-0 ml-2">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{n.message}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t border-gray-50 bg-gray-50/30">
              <button className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">View All Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Inject custom styles once */}
      <style>{navItemStyles}</style>

      <nav className="sticky top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800 shadow-[0_1px_12px_rgba(0,0,0,0.06)] transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 group-hover:shadow-primary-500/50 group-hover:-translate-y-0.5 transition-all duration-300">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  Agri<span className="text-primary-600 uppercase">Saar</span>
                </span>
                <span className="text-[9px] block text-primary-600/80 dark:text-primary-400 -mt-0.5 font-bold uppercase tracking-[0.15em]">
                  Smart Farming AI
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1 mx-4">
              {navLinks.map(({ path, label, Icon }) => (
                <NavItem
                  key={path}
                  path={path}
                  label={label}
                  Icon={Icon}
                  isActive={location.pathname === path}
                />
              ))}
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-2.5 shrink-0">
              <LanguageSelector />
              <NotificationBell />
              <UserProfile />
              <div id="google_translate_element" className="hidden" />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors active:scale-95"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ path, label, Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]
                      ${active
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg ${active ? 'bg-white/20' : 'bg-primary-50'}`}>
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary-600'}`} />
                    </div>
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
