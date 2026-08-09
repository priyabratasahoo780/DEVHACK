/**
 * AgriSaar Alert Service
 * Sends real SMS via Fast2SMS (free Indian SMS API)
 * Also triggers browser notifications
 */

const FAST2SMS_API_KEY = 'your_fast2sms_api_key'; // User should replace this
const DEFAULT_PHONE = '7870929584'; // Farmer's phone number

/**
 * Send SMS alert via Fast2SMS free API
 * @param {string} message - Alert message
 * @param {string} phone - Phone number (default: farmer's number)
 */
export async function sendSMSAlert(message, phone = DEFAULT_PHONE) {
  try {
    // Try Fast2SMS (free Indian SMS gateway)
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q', // Quick SMS route (free)
        message: message.substring(0, 160), // SMS limit
        language: 'english',
        flash: 0,
        numbers: phone,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('SMS sent:', data);
      return { success: true, method: 'sms', data };
    }
  } catch (err) {
    console.warn('Fast2SMS failed:', err.message);
  }

  // Fallback: Open SMS app with prefilled message
  try {
    window.open(`sms:${phone}?body=${encodeURIComponent(message)}`, '_blank');
    return { success: true, method: 'sms_app' };
  } catch {
    return { success: false };
  }
}

/**
 * Send WhatsApp alert
 * @param {string} message - Alert message
 * @param {string} phone - Phone number with country code
 */
export function sendWhatsAppAlert(message, phone = `91${DEFAULT_PHONE}`) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  return { success: true, method: 'whatsapp' };
}

/**
 * Request + Show browser push notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} icon - Notification icon URL
 */
export async function showBrowserNotification(title, body, icon = '/favicon.ico') {
  if (!('Notification' in window)) return { success: false, reason: 'not_supported' };

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      vibrate: [200, 100, 200],
      tag: 'agrisaar-alert',
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return { success: true, method: 'browser_notification' };
  }

  return { success: false, reason: 'denied' };
}

/**
 * Auto-alert system — checks weather and sends alerts automatically
 * Call this when weather data loads
 */
export async function autoWeatherAlert(current, city, forecast) {
  const temp = current?.temp || 30;
  const humidity = current?.humidity || 50;
  const desc = (current?.description || '').toLowerCase();
  const isRaining = desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower');
  const willRain = forecast?.some(f => {
    const d = (f.description || '').toLowerCase();
    return d.includes('rain') || d.includes('shower') || d.includes('thunder');
  });

  const alerts = [];

  // Rain alert
  if (isRaining || willRain || humidity > 85) {
    const msg = `⚠️ AgriSaar RAIN ALERT\n📍 ${city || 'Your Area'}\n☔ Rain expected!\n\n👉 Cover your crops\n👉 Move produce indoors\n👉 Don't spray today\n\n— AgriSaar Smart Farming`;
    alerts.push({
      type: 'rain',
      title: '🌧️ Rain Alert — Cover Your Crops!',
      message: msg,
      notifBody: `Rain expected in ${city || 'your area'}. Cover crops & move produce indoors.`,
    });
  }

  // Heat alert
  if (temp > 35) {
    const msg = `⚠️ AgriSaar HEAT ALERT\n📍 ${city || 'Your Area'}\n🌡️ Temperature: ${temp}°C\n\n👉 Irrigate morning/evening\n👉 Don't spray in afternoon\n👉 Apply mulch to soil\n\n— AgriSaar Smart Farming`;
    alerts.push({
      type: 'heat',
      title: `🔥 Heat Alert — ${temp}°C in ${city || 'Your Area'}!`,
      message: msg,
      notifBody: `${temp}°C detected. Irrigate crops morning/evening. Avoid 12-3PM outdoor work.`,
    });
  }

  // Cold alert
  if (temp < 8) {
    const msg = `⚠️ AgriSaar FROST ALERT\n📍 ${city || 'Your Area'}\n❄️ Temperature: ${temp}°C\n\n👉 Cover seedlings\n👉 Light irrigation helps\n\n— AgriSaar Smart Farming`;
    alerts.push({
      type: 'cold',
      title: `❄️ Frost Alert — ${temp}°C!`,
      message: msg,
      notifBody: `${temp}°C detected. Cover seedlings with plastic. Light irrigation prevents frost.`,
    });
  }

  // Send browser notifications for ALL detected alerts
  for (const alert of alerts) {
    await showBrowserNotification(alert.title, alert.notifBody);
  }

  // Store sent alerts to avoid duplicate SMS
  const lastAlertKey = 'agrisaar_last_alert';
  const lastAlert = localStorage.getItem(lastAlertKey);
  const today = new Date().toDateString();

  if (alerts.length > 0 && lastAlert !== today) {
    // Auto-trigger SMS for the most critical alert (once per day)
    const critical = alerts[0];
    await sendSMSAlert(critical.message);
    localStorage.setItem(lastAlertKey, today);
  }

  return alerts;
}

/**
 * Get farmer's phone number
 */
export function getFarmerPhone() {
  return localStorage.getItem('agrisaar_phone') || DEFAULT_PHONE;
}

/**
 * Set farmer's phone number
 */
export function setFarmerPhone(phone) {
  localStorage.setItem('agrisaar_phone', phone);
}
