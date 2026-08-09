const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function timestamp() {
  return new Date().toLocaleTimeString('en-IN', { hour12: false });
}

export const logger = {
  info: (msg) => console.log(`${COLORS.green}[${timestamp()}] ✅ ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}[${timestamp()}] ⚠️  ${msg}${COLORS.reset}`),
  error: (msg) => console.log(`${COLORS.red}[${timestamp()}] ❌ ${msg}${COLORS.reset}`),
  debug: (msg) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${COLORS.cyan}[${timestamp()}] 🔍 ${msg}${COLORS.reset}`);
    }
  },
  ai: (msg) => console.log(`${COLORS.magenta}[${timestamp()}] 🤖 ${msg}${COLORS.reset}`)
};
