import { useEffect, useMemo, useState } from 'react'
import { ArchiveMonogram } from '../common/LuxuryImage'

function buildGalleryImages(product, activeColorImage) {
  const gallery = []
  const seen = new Set()

  function push(src, alt) {
    if (!src || seen.has(src)) return
    seen.add(src)
    gallery.push({ src, alt: alt || product.name })
  }

  if (activeColorImage) push(activeColorImage, `${product.name} selected`)
  push(product.primaryImage, product.images?.[0]?.alt || product.name)
  push(product.secondaryImage, product.images?.[1]?.alt || `${product.name} alternate`)
  ;(product.images || []).forEach((image, index) => {
    push(image.src, image.alt || `${product.name} view ${index + 1}`)
  })

  return gallery
}

export default function ImageGallery({ product, activeColorImage }) {
  const images = useMemo(
    () => buildGalleryImages(product, activeColorImage),
    [product, activeColorImage],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
  const [zooming, setZooming] = useState(false)
  const [failedMap, setFailedMap] = useState({})

  useEffect(() => {
    setActiveIndex(0)
    setFailedMap({})
  }, [product.id, activeColorImage])

  const activeImage = images[activeIndex] || images[0]
  if (!activeImage) {
    return (
      <div className="aspect-[4/5] overflow-hidden border border-brand-border bg-brand-surface">
        <ArchiveMonogram title={product.name} />
      </div>
    )
  }

  const activeFailed = failedMap[activeImage.src]

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-start">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden border border-brand-border bg-brand-surface lg:flex-1"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect()
          setZoomOrigin({
            x: ((event.clientX - bounds.left) / bounds.width) * 100,
            y: ((event.clientY - bounds.top) / bounds.height) * 100,
          })
        }}
      >
        {activeFailed ? (
          <ArchiveMonogram title={product.name} />
        ) : (
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            onError={() =>
              setFailedMap((current) => ({ ...current, [activeImage.src]: true }))
            }
            className="h-full w-full object-cover text-transparent transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: zooming ? 'scale(1.6)' : 'scale(1)',
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            }}
          />
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0"
          role="listbox"
          aria-label="Product images"
        >
          {images.map((image, index) => {
            const selected = index === activeIndex
            const failed = failedMap[image.src]
            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => setActiveIndex(index)}
                className={[
                  'relative h-16 w-16 shrink-0 overflow-hidden border transition-all duration-300 lg:h-20 lg:w-20',
                  selected
                    ? 'border-brand-gold'
                    : 'border-brand-border hover:border-brand-gold/50',
                ].join(' ')}
              >
                {failed ? (
                  <ArchiveMonogram title="" />
                ) : (
                  <img
                    src={image.src}
                    alt=""
                    aria-hidden="true"
                    onError={() =>
                      setFailedMap((current) => ({ ...current, [image.src]: true }))
                    }
                    className="h-full w-full object-cover text-transparent"
                  />
                )}
                <span className="sr-only">View image {index + 1}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
