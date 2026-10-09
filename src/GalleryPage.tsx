import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Phone } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { SmoothScroll } from './components/SmoothScroll'
import { Lightbox } from './components/gallery/Lightbox'
import { Footer } from './components/sections/Contact'
import { MagneticButton } from './components/ui/MagneticButton'
import { Eyebrow, FadeIn, RevealText } from './components/ui/Reveal'
import { photos, thumbSrc, type Make, type Photo } from './data/gallery'
import { business } from './data/site'
import { cn } from './lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

type Filter = 'All' | 'In the bay' | Make

const makesByCount = Object.entries(
  photos.reduce<Record<string, number>>((acc, p) => {
    if (p.make) acc[p.make] = (acc[p.make] ?? 0) + 1
    return acc
  }, {}),
).sort((a, b) => b[1] - a[1])

const FILTERS: { id: Filter; count: number }[] = [
  { id: 'All', count: photos.length },
  { id: 'In the bay', count: photos.filter((p) => p.work).length },
  ...makesByCount.map(([make, count]) => ({ id: make as Make, count })),
]

function matches(p: Photo, f: Filter) {
  if (f === 'All') return true
  if (f === 'In the bay') return !!p.work
  return p.make === f
}

function useColumnCount() {
  const get = () => {
    const w = window.innerWidth
    return w < 1024 ? 2 : w < 1536 ? 3 : 4
  }
  const [n, setN] = useState(get)
  useEffect(() => {
    const onResize = () => setN(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return n
}

/** Two rows of thumbnails that slide in opposite directions as the page scrolls. */
function FilmStrip() {
  const { scrollY } = useScroll()
  const x1 = useTransform(scrollY, [0, 1200], ['0%', '-22%'])
  const x2 = useTransform(scrollY, [0, 1200], ['-22%', '0%'])
  const rows = [photos.slice(0, 14), photos.slice(14, 28)]
  return (
    <div className="relative mt-16 space-y-3 overflow-hidden md:mt-20" aria-hidden>
      {rows.map((row, r) => (
        <motion.div key={r} style={{ x: r === 0 ? x1 : x2 }} className="flex w-max gap-3">
          {[...row, ...row].map((p, i) => (
            <img
              key={`${p.file}-${i}`}
              src={thumbSrc(p)}
              alt=""
              loading={i < 6 ? 'eager' : 'lazy'}
              className="h-28 w-44 shrink-0 rounded-xl object-cover opacity-70 md:h-40 md:w-64"
            />
          ))}
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent md:w-48" />
    </div>
  )
}

function Tile({ photo, delay, onOpen }: { photo: Photo; delay: number; onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      aria-label={`Open ${photo.caption}`}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.8, delay, ease }}
      className="group relative block w-full overflow-hidden rounded-2xl bg-ink-3 text-left focus-visible:outline-2 focus-visible:outline-brand"
      style={{ aspectRatio: String(1 / photo.ratio) }}
    >
      <img
        src={thumbSrc(photo)}
        alt={photo.caption}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      {photo.work && (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-paper backdrop-blur">
          <span className="size-1.5 rounded-full bg-brand" /> In the bay
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 transition-transform duration-500 group-hover:translate-y-0 md:p-4">
        {photo.make && (
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-brand md:block">{photo.make}</p>
        )}
        <p className="font-display text-xs leading-snug text-paper md:text-sm">{photo.caption}</p>
      </div>
    </motion.button>
  )
}

export function GalleryPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const [open, setOpen] = useState<number | null>(null)
  const columns = useColumnCount()
  const gridTop = useRef<HTMLDivElement>(null)

  const visible = useMemo(() => photos.filter((p) => matches(p, filter)), [filter])

  // Masonry: place each photo in the currently shortest column.
  const cols = useMemo(() => {
    const out: { photo: Photo; index: number }[][] = Array.from({ length: columns }, () => [])
    const heights = new Array(columns).fill(0)
    visible.forEach((photo, index) => {
      const c = heights.indexOf(Math.min(...heights))
      out[c].push({ photo, index })
      heights[c] += photo.ratio
    })
    return out
  }, [visible, columns])

  const choose = (f: Filter) => {
    setFilter(f)
    const top = gridTop.current?.getBoundingClientRect().top ?? 0
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 140, behavior: 'smooth' })
  }

  return (
    <div className="grain">
      <SmoothScroll />
      <Navbar page="gallery" />

      <main>
        <header className="relative overflow-hidden bg-ink pt-36 pb-12 md:pt-44">
          <div className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(215,38,46,0.18),transparent_60%)]" />
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <Eyebrow>The Garage</Eyebrow>
            <RevealText
              as="h1"
              text="Every car tells a story."
              className="mt-6 max-w-5xl font-display text-[12vw] leading-[0.9] tracking-tight text-paper md:text-[7vw]"
            />
            <FadeIn delay={0.3} className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <p className="max-w-md text-paper/65">
                Straight from our shop floor in Pompano Beach: the cars we service, tune and care for, from factory
                maintenance to full performance builds.
              </p>
              <dl className="flex gap-10">
                {[
                  [photos.length, 'Photos'],
                  [makesByCount.length, 'Marques'],
                  [FILTERS[1].count, 'In the bay'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">{l}</dt>
                    <dd className="font-display text-4xl text-paper">{n}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>
          <FilmStrip />
        </header>

        {/* Filters */}
        <div ref={gridTop} className="sticky top-[76px] z-30 md:top-[92px]">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-ink/70 p-1 backdrop-blur-xl [scrollbar-width:none]">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => choose(f.id)}
                  aria-pressed={filter === f.id}
                  className={cn(
                    'relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors',
                    filter === f.id ? 'text-white' : 'text-paper/60 hover:text-paper',
                  )}
                >
                  {filter === f.id && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-brand"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {f.id} <span className="font-mono text-[10px] opacity-60">{f.count}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-4 pt-8 pb-28 md:px-8" aria-label="Photo gallery">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filter}-${columns}`}
              className="flex gap-3 md:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              {cols.map((col, c) => (
                <div key={c} className="flex min-w-0 flex-1 flex-col gap-3 md:gap-4">
                  {col.map(({ photo, index }) => (
                    <Tile key={photo.file} photo={photo} delay={(c % columns) * 0.07} onOpen={() => setOpen(index)} />
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-line bg-ink-2 px-4 py-24 md:px-8 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(215,38,46,0.3),transparent_60%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-brand">Your turn</p>
            <RevealText
              text="Want your car on this wall?"
              className="mt-6 justify-center font-display text-4xl leading-[1.05] text-paper md:text-7xl"
            />
            <FadeIn delay={0.2} className="mt-10 flex flex-wrap justify-center gap-3">
              <MagneticButton href="./#contact">Book your service</MagneticButton>
              <a
                href={`tel:${business.advisors[0].phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm text-paper transition-colors hover:border-white/40"
              >
                <Phone className="size-4" /> {business.advisors[0].phone}
              </a>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer page="gallery" />

      <AnimatePresence>
        {open !== null && <Lightbox photos={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  )
}
