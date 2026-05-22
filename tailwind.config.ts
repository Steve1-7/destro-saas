/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#080b12',
          1: '#0d1120',
          2: '#121828',
          3: '#1a2235',
        },
        accent: {
          DEFAULT: '#6ee7b7',
          2: '#3b82f6',
          3: '#a78bfa',
        },
        border: 'rgba(255,255,255,0.07)',
      },
      keyframes: {
        'accordion-down': { from: { height: 0 }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: 0 } },
        pulse: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulse: 'pulse 2s infinite',
        spin: 'spin 0.7s linear infinite',
      },
      borderRadius: { lg: '12px', md: '8px', sm: '6px' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
