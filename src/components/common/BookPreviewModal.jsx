import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { motionEase } from './MotionPrimitives'

const SAMPLE_EXCERPT = `Chapter One — The First Ledger

The vault door remembered every hand that had ever turned its wheel. Mark Steffen's protagonist stood beneath a single brass lamp, listening to the building settle like an old library exhaling. On the table: a ledger bound in obsidian calfskin, its gilt edges catching the light in thin, unforgiving lines.

He opened to page one.

The first entry was dated thirty years earlier. The second was dated tomorrow.

Outside, rain stitched the city into silence. Inside, the ink still looked wet.`

function Waveform({ playing, progress }) {
  const bars = Array.from({ length: 42 }, (_, index) => {
    const wave = Math.abs(Math.sin(index * 0.45)) * 0.7 + 0.3
    const active = index / 42 <= progress
    return (
      <span
        key={index}
        className={[
          'w-[3px] rounded-full transition-colors duration-200',
          active ? 'bg-brand-gold' : 'bg-brand-border',
          playing ? 'animate-pulse' : '',
        ].join(' ')}
        style={{
          height: `${12 + wave * 28}px`,
          animationDelay: `${index * 40}ms`,
        }}
      />
    )
  })

  return <div className="flex h-14 items-end gap-[3px]">{bars}</div>
}

export default function BookPreviewModal() {
  const { bookPreviewProduct: product, closeBookPreview } = useCart()
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!product) {
      setPlaying(false)
      setProgress(0)
      return undefined
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') closeBookPreview()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [product, closeBookPreview])

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      return undefined
    }

    timerRef.current = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 1) {
          setPlaying(false)
          return 1
        }
        return value + 0.008
      })
    }, 80)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [playing])

  return (
    <AnimatePresence>
      {product && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.button
        type="button"
        className="modal-backdrop absolute inset-0 backdrop-blur-sm"
        aria-label="Close book preview"
        onClick={closeBookPreview}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview ${product.name}`}
        className="glass-panel relative z-10 w-full max-w-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.32, ease: motionEase }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-border px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
              Literary Preview
            </p>
            <h2 className="mt-1 font-serif text-2xl tracking-wide text-brand-text">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeBookPreview}
            className="inline-flex h-9 w-9 items-center justify-center text-brand-muted hover:text-brand-text"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-brand-border p-6 md:border-r md:border-b-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-gold">
              Read Chapter 1
            </p>
            <div className="mt-4 max-h-72 overflow-y-auto pr-2 text-sm leading-relaxed text-brand-muted whitespace-pre-line">
              {SAMPLE_EXCERPT}
            </div>
          </div>

          <div className="bg-ambient-noise p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand-gold">
              Audio Prologue
            </p>
            <p className="mt-2 text-sm text-brand-muted">
              A short atmospheric reading of the opening pages.
            </p>

            <div className="mt-6 rounded-sm border border-brand-border bg-brand-bg/50 p-4">
              <Waveform playing={playing} progress={progress} />
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (progress >= 1) setProgress(0)
                    setPlaying((value) => !value)
                  }}
                  className="btn-gold-shimmer inline-flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label={playing ? 'Pause prologue' : 'Play prologue'}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-brand-border">
                    <div
                      className="h-full bg-gold-gradient transition-[width] duration-100"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] tabular-nums text-brand-muted">
                    {Math.floor(progress * 95)}s / 1:35
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  )
}
