/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#08090C',
          surface: '#111318',
          card: '#171A21',
          cardHover: '#1E222B',
          border: '#262A34',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#AA820A',
          text: '#F5F5F7',
          muted: '#949BA6',
          danger: '#EF4444',
          success: '#10B981',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Cormorant Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(to right, #D4AF37, #F3E5AB, #AA820A)',
        'ambient-spotlight':
          'radial-gradient(ellipse 60% 50% at 20% 10%, rgba(212,175,55,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(243,229,171,0.06), transparent 50%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.28)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-gold': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.45)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)',
            transform: 'scale(1.05)',
          },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'pulse-gold': 'pulse-gold 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
