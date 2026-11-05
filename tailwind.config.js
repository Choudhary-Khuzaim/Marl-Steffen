/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--brand-bg)',
          surface: 'var(--brand-surface)',
          card: 'var(--brand-card)',
          cardHover: 'var(--brand-card-hover)',
          border: 'var(--brand-border)',
          gold: 'var(--brand-gold)',
          goldLight: 'var(--brand-gold-light)',
          goldDark: 'var(--brand-gold-dark)',
          text: 'var(--brand-text)',
          muted: 'var(--brand-muted)',
          danger: 'var(--brand-danger)',
          success: 'var(--brand-success)',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Cormorant Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(to right, var(--brand-gold), var(--brand-gold-light), var(--brand-gold-dark))',
        'ambient-spotlight':
          'radial-gradient(ellipse 60% 50% at 20% 10%, rgba(var(--brand-gold-rgb),0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(var(--brand-gold-light-rgb),0.06), transparent 50%)',
      },
      boxShadow: {
        brand: 'var(--brand-shadow)',
        'gold-glow': '0 0 25px rgba(var(--brand-gold-rgb), 0.28)',
        'gold-glow-lg': '0 0 40px rgba(var(--brand-gold-rgb), 0.4)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-gold': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(var(--brand-gold-rgb), 0.45)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(var(--brand-gold-rgb), 0)',
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
