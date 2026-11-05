import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const iconMotion = {
  initial: { opacity: 0, rotate: -40, scale: 0.6, y: 4 },
  animate: { opacity: 1, rotate: 0, scale: 1, y: 0 },
  exit: { opacity: 0, rotate: 40, scale: 0.6, y: -4 },
}

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        'relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-brand-border/80 bg-brand-surface/60 text-brand-text shadow-brand transition-colors duration-300 hover:border-brand-gold/50 hover:text-brand-gold',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Editorial Parchment' : 'Obsidian Noir'}
      data-theme={theme}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            className="inline-flex"
            initial={iconMotion.initial}
            animate={iconMotion.animate}
            exit={iconMotion.exit}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sun size={18} strokeWidth={1.75} className="text-brand-gold" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            className="inline-flex"
            initial={iconMotion.initial}
            animate={iconMotion.animate}
            exit={iconMotion.exit}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Moon size={18} strokeWidth={1.75} className="text-brand-goldDark" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
