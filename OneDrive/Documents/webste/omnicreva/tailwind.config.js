/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00FF00',
        'neon-dim': '#00CC00',
        'neon-glow': '#00FF0033',
        'dark-base': '#020202',
        'dark-card': '#0A0A0A',
        'dark-border': '#1A1A1A',
        'dark-surface': '#111111',
        'purple-prime': '#7B2FBE',
        'purple-light': '#9D4EDD',
        'purple-glow': '#7B2FBE33',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00FF00 0%, #00CC00 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7B2FBE 0%, #9D4EDD 50%, #C77DFF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #020202 0%, #0A0A0A 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 50% 50%, #0A0A1A 0%, #020202 70%)',
        'gradient-card': 'linear-gradient(145deg, #111111 0%, #0A0A0A 100%)',
        'grid-pattern': 'linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0,255,0,0.4), 0 0 40px rgba(0,255,0,0.1)',
        'neon-sm': '0 0 10px rgba(0,255,0,0.3)',
        'purple': '0 0 20px rgba(123,47,190,0.4), 0 0 40px rgba(123,47,190,0.1)',
        'card': '0 8px 32px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.03)',
        'glass': '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,255,0,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0,255,0,0.8), 0 0 60px rgba(0,255,0,0.3)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
