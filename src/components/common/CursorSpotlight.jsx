import { useEffect, useState } from 'react'

export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    if (!media.matches) return undefined

    function onMove(event) {
      setPos({ x: event.clientX, y: event.clientY })
      setVisible(true)
    }

    function onLeave() {
      setVisible(false)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] hidden mix-blend-multiply lg:block dark:mix-blend-screen"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}
    >
      <div
        className="absolute h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          background:
            'radial-gradient(circle, rgba(var(--brand-gold-rgb),0.16) 0%, rgba(var(--brand-gold-rgb),0.05) 35%, transparent 70%)',
        }}
      />
    </div>
  )
}
