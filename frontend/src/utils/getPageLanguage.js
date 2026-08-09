/**
 * Detects the active language on the page.
 * Works with Google Translate (checks html lang attribute + cookie)
 * Returns a BCP-47 code like 'hi', 'en', 'bn', 'ta', etc.
 */
export default function getPageLanguage() {
  // 1. Google Translate sets the html lang attribute
  const htmlLang = document.documentElement.lang;
  if (htmlLang && htmlLang !== 'en' && htmlLang.length >= 2) {
    return htmlLang.split('-')[0]; // 'hi-IN' -> 'hi'
  }

  // 2. Check Google Translate cookie
  const match = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  if (match && match[1] !== 'en') {
    return match[1];
  }

  return 'en';
}

/**
 * Maps short language codes to speechSynthesis lang codes
 */
export function getSpeechLang(code) {
  const map = {
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    en: 'en-IN',
  };
  return map[code] || 'en-IN';
}
