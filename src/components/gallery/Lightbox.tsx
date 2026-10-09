import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { fullSrc, thumbSrc, type Photo } from '../../data/gallery'
import { cn } from '../../lib/cn'
import { lockScroll } from '../../lib/scroll'

const ease = [0.16, 1, 0.3, 1] as const

export function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const [direction, setDirection] = useState(0)
  const strip = useRef<HTMLDivElement>(null)
  const photo = photos[index]

  const go = useCallback(
    (step: number) => {
      setDirection(step)
      onIndex((index + step + photos.length) % photos.length)
    },
    [index, onIndex, photos.length],
  )

  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Keep the active thumbnail in view.
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [index])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(1)
    else if (info.offset.x > 80 || info.velocity.x > 500) go(-1)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-xl"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <p className="font-mono text-xs tracking-[0.3em] text-mute">
          <span className="text-paper">{String(index + 1).padStart(2, '0')}</span> / {String(photos.length).padStart(2, '0')}
        </p>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          className="grid size-11 place-items-center rounded-full border border-white/15 text-paper transition-colors hover:border-brand hover:bg-brand"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 md:px-24">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={photo.file}
            src={fullSrc(photo)}
            alt={photo.caption}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 120, scale: d === 0 ? 0.92 : 1 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -120 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            className="max-h-full max-w-full cursor-grab touch-pan-y select-none rounded-xl object-contain shadow-2xl active:cursor-grabbing"
            style={{ backgroundImage: `url(${thumbSrc(photo)})`, backgroundSize: 'cover' }}
            draggable={false}
          />
        </AnimatePresence>

        <button
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/60 text-paper backdrop-blur transition-colors hover:border-brand hover:bg-brand md:grid"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/60 text-paper backdrop-blur transition-colors hover:border-brand hover:bg-brand md:grid"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pt-4 text-center md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.file}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">
              {[photo.make, photo.work && 'In the bay'].filter(Boolean).join(' · ') || 'Eurowerks'}
            </p>
            <p className="mt-1 font-display text-lg text-paper md:text-2xl">{photo.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div ref={strip} className="flex gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] md:px-8">
        {photos.map((p, i) => (
          <button
            key={p.file}
            data-index={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1)
              onIndex(i)
            }}
            aria-label={`Show ${p.caption}`}
            className={cn(
              'relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-300 md:h-16 md:w-24',
              i === index ? 'opacity-100 ring-2 ring-brand' : 'opacity-40 hover:opacity-80',
            )}
          >
            <img src={thumbSrc(p)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
