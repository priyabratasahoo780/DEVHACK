/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#e0e5ec',
          darkBg: '#2d3748',
          text: '#4a5568',
          darkText: '#e2e8f0'
        },
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
          950: '#0d3b11'
        },
        earth: {
          50: '#fdf8f0',
          100: '#f5e6d0',
          200: '#e8c99a',
          300: '#d4a76a',
          400: '#c08a42',
          500: '#a87332',
          600: '#8b5e2a',
          700: '#6d4a22'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px rgba(163, 177, 198, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        'neu-pressed': 'inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
        'neu-dark-flat': '8px 8px 16px rgba(15, 20, 25, 0.8), -8px -8px 16px rgba(50, 60, 75, 0.4)',
        'neu-dark-pressed': 'inset 6px 6px 12px rgba(15, 20, 25, 0.8), inset -6px -6px 12px rgba(50, 60, 75, 0.4)',
        'clay': '10px 10px 20px rgba(163, 177, 198, 0.4), inset -6px -6px 12px rgba(163, 177, 198, 0.2), inset 6px 6px 12px rgba(255, 255, 255, 1)',
        'clay-dark': '10px 10px 20px rgba(15, 20, 25, 0.8), inset -8px -8px 16px rgba(15, 20, 25, 0.6), inset 8px 8px 16px rgba(50, 60, 75, 0.6)',
        'clay-card': '8px 8px 24px rgba(0, 0, 0, 0.08), inset -4px -4px 12px rgba(0, 0, 0, 0.04), inset 4px 4px 12px rgba(255, 255, 255, 1)',
        'clay-input': 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.8)',
        'clay-btn': '8px 8px 16px rgba(34, 197, 94, 0.3), inset -4px -4px 8px rgba(21, 128, 61, 0.4), inset 4px 4px 8px rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
