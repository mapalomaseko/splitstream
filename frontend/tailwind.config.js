/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: '#4AAFFF',
          skySoft: '#E7F4FF',
          navy: '#0A0F1E',
          ink: '#121828',
          mist: '#F5FAFF',
          line: '#D4E6F8',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 24px rgba(10, 15, 30, 0.08)',
        glow: '0 0 0 1px rgba(74, 175, 255, 0.2), 0 18px 40px rgba(74, 175, 255, 0.22)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseHalo: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74, 175, 255, 0.25)' },
          '50%': { boxShadow: '0 0 0 12px rgba(74, 175, 255, 0)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'fade-up': 'fade-up 500ms ease-out both',
        pulseHalo: 'pulseHalo 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}