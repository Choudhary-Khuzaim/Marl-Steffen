import { useEffect, useState } from 'react'

export function ArchiveMonogram({ title = '', className = '' }) {
  return (
    <div
      className={[
        'flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),#08090C_70%)] px-4 text-center',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      <div className="border border-brand-gold/35 px-4 py-6 shadow-[0_0_30px_rgba(212,175,55,0.12)]">
        <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-brand-gold">
          Mark Steffen Archive
        </p>
        {title ? (
          <p className="mt-3 font-serif text-sm tracking-[0.08em] text-brand-text/90 line-clamp-3">
            {title}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Bulletproof product image with luxury archive fallback.
 * Uses text-transparent so alt text never flashes over badges.
 */
export default function LuxuryImage({
  src,
  alt = '',
  title = '',
  className = '',
  imgClassName = '',
  showVignette = false,
  ...props
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFailed(false)
    setLoaded(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={['relative h-full w-full overflow-hidden', className].join(' ')}>
        <ArchiveMonogram title={title || alt} />
        {showVignette && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090C]/85 via-transparent to-black/30"
            aria-hidden="true"
          />
        )}
      </div>
    )
  }

  return (
    <div className={['relative h-full w-full overflow-hidden', className].join(' ')}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        className={[
          'h-full w-full object-cover text-transparent',
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300',
          imgClassName,
        ].join(' ')}
        {...props}
      />
      {!loaded && <ArchiveMonogram title={title || alt} className="absolute inset-0" />}
      {showVignette && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090C]/85 via-transparent to-black/30"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
