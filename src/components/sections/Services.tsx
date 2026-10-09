import { useRef, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services, type Service } from '../../data/site'
import { cn } from '../../lib/cn'
import { Eyebrow, FadeIn, RevealText } from '../ui/Reveal'

function SpotlightCard({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(215,38,46,0.22), transparent 70%)`
  const border = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(255,80,88,0.9), transparent 70%)`

  const onMove = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  return (
    <FadeIn delay={(i % 3) * 0.08} className={cn('min-h-[280px]', s.span)}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(-400)
          my.set(-400)
        }}
        className="group relative h-full overflow-hidden rounded-3xl bg-ink-3 p-px"
      >
        {/* animated border */}
        <motion.div className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: border }} />
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(1.5rem-1px)] bg-ink-2 p-7">
          {s.image && (
            <>
              <img
                src={s.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35 grayscale transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-60 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
            </>
          )}
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
          <div className="relative flex items-start justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">{s.kicker}</p>
            <span className="grid size-10 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="relative mt-16">
            <h3 className={cn('font-display text-paper', s.span?.includes('row-span-2') ? 'text-3xl md:text-5xl' : 'text-2xl')}>
              {s.title}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/65">{s.body}</p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export function Services() {
  return (
    <section id="services" className="relative bg-ink px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>Service & Performance</Eyebrow>
            <RevealText
              text="From oil service to full performance builds."
              className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] text-paper md:text-6xl"
            />
          </div>
          <FadeIn>
            <p className="max-w-sm text-paper/60">
              Everything from basic oil changes to state-of-the-art performance modifications — handled in-house, to
              manufacturer standard.
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
          {services.map((s, i) => (
            <SpotlightCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
