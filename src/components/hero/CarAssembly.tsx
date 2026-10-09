import { useCallback, useEffect, useRef, useState } from 'react'
import {
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { MagneticButton } from '../ui/MagneticButton'

const easeOut = cubicBezier(0.16, 1, 0.3, 1)

// Frames extracted from the assembly film (public/hero/f001.webp … f097.webp).
const FRAME_COUNT = 97
const frameSrc = (i: number) => `hero/f${String(i + 1).padStart(3, '0')}.webp`

/** Scroll progress at which the film reaches its last frame. */
const FILM_END = 0.82

/** Page background, used to feather the film's edges. */
const INK = '#070708'

/** Each stage of the film, by frame, tied to the Eurowerks service it represents. */
const STAGES = [
  { frame: 0, title: 'Cockpit & electronics', service: 'Diagnostics & electrical' },
  { frame: 17, title: 'Steering & front structure', service: 'Precision alignment' },
  { frame: 33, title: 'Chassis, wheels & brakes', service: 'Brake systems' },
  { frame: 49, title: 'Suspension & drivetrain', service: 'Suspension · ECU tuning' },
  { frame: 65, title: 'Body panels', service: 'Factory-matched service' },
  { frame: 81, title: 'Paint & finish', service: 'The car spa' },
  { frame: 90, title: 'Lights & sensors', service: 'ADAS calibration' },
]

const frameAt = (v: number) => Math.min(FRAME_COUNT - 1, Math.max(0, Math.round((v / FILM_END) * (FRAME_COUNT - 1))))

function stageAt(frame: number) {
  let i = 0
  STAGES.forEach((s, idx) => {
    if (frame >= s.frame) i = idx
  })
  return i
}

/** Draws the frame for the current scroll position onto a full-screen canvas. */
function FilmCanvas({ p, ready }: { p: MotionValue<number>; ready: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const frames = useRef<HTMLImageElement[]>([])
  const current = useRef(0)

  const draw = useCallback(() => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    // Fall back to the closest earlier frame that has finished loading.
    let i = current.current
    while (i > 0 && !frames.current[i]?.complete) i--
    const img = frames.current[i]
    if (!img?.complete || !img.naturalWidth) return

    const { width: w, height: h } = c
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    // Landscape: cover the screen. Portrait: fit the car's width so it isn't cropped away.
    const scale = w / h >= 1 ? Math.max(w / iw, h / ih) : (w * 1.45) / iw
    const dw = iw * scale
    const dh = ih * scale
    const x = (w - dw) / 2
    const y = (h - dh) / 2 + (w / h >= 1 ? 0 : h * 0.06)
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(img, x, y, dw, dh)
    // On portrait screens the film doesn't fill the height: feather its top and bottom into the page.
    if (dh < h) {
      const fade = dh * 0.28
      for (const [from, to] of [
        [y, y + fade],
        [y + dh, y + dh - fade],
      ]) {
        const g = ctx.createLinearGradient(0, from, 0, to)
        g.addColorStop(0, INK)
        g.addColorStop(1, 'rgba(7,7,8,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, Math.min(from, to), w, fade)
      }
    }
  }, [])

  // Load the first frame immediately, then the rest in order.
  useEffect(() => {
    frames.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (i <= current.current) draw()
      }
      img.src = frameSrc(i)
      return img
    })
  }, [draw])

  useEffect(() => {
    const resize = () => {
      const c = canvas.current
      if (!c) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      draw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [draw])

  useMotionValueEvent(p, 'change', (v) => {
    const f = frameAt(v)
    if (f === current.current) return
    current.current = f
    requestAnimationFrame(draw)
  })

  useEffect(() => {
    current.current = frameAt(p.get())
    draw()
  }, [p, draw])

  return (
    <motion.canvas
      ref={canvas}
      className="absolute inset-0 h-full w-full"
      initial={{ opacity: 0, scale: 1.08 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden
    />
  )
}

function Counter({ p }: { p: MotionValue<number> }) {
  const text = useTransform(p, (v) => String(Math.round(Math.min(1, v / FILM_END) * 100)).padStart(3, '0'))
  return <motion.span>{text}</motion.span>
}

export function CarAssembly({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35 })
  const done = useMotionValue(1)
  const p = reduce ? done : smooth

  const [stage, setStage] = useState(0)
  useMotionValueEvent(p, 'change', (v) => {
    const s = stageAt(frameAt(v))
    setStage((prev) => (prev === s ? prev : s))
  })

  const introOpacity = useTransform(p, [0, 0.07], [1, 0])
  const introY = useTransform(p, [0, 0.1], [0, -60])
  const introBlur = useTransform(p, [0, 0.07], ['blur(0px)', 'blur(12px)'])
  const hudOpacity = useTransform(p, [0, 0.04, FILM_END, FILM_END + 0.05], [0.5, 1, 1, 0])
  const progressScale = useTransform(p, [0, FILM_END], [0, 1])
  const finaleOpacity = useTransform(p, [FILM_END + 0.02, FILM_END + 0.1], [0, 1])
  const finaleY = useTransform(p, [FILM_END + 0.02, FILM_END + 0.1], [40, 0], { ease: easeOut })
  const finalePointer = useTransform(p, (v) => (v > FILM_END + 0.04 ? 'auto' : 'none'))
  const filmScale = useTransform(p, [0, FILM_END], [1.12, 1])
  // Wide screens: drop the car lower at the finale so it clears the headline and buttons.
  const [wide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768)
  const filmY = useTransform(p, [FILM_END, 1], ['0%', wide ? '22%' : '10%'])
  const topShade = useTransform(p, [0, 0.08, FILM_END, FILM_END + 0.08], [0.9, 0.35, 0.35, 1])
  const glowOpacity = useTransform(p, [FILM_END - 0.1, FILM_END + 0.06], [0, 1])

  return (
    <section ref={ref} id="top" className="relative h-[560vh] bg-ink" aria-label="Eurowerks — car assembly">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* The film */}
        <motion.div className="absolute inset-0" style={{ scale: filmScale, y: filmY }}>
          <FilmCanvas p={p} ready={ready || !!reduce} />
        </motion.div>

        {/* Blend the film's edges into the page */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-ink via-ink/60 to-transparent"
          style={{ opacity: topShade }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(7,7,8,0.85)_100%)]" />
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(215,38,46,0.35),transparent_65%)] mix-blend-screen"
          style={{ opacity: glowOpacity }}
        />

        {/* HUD — top */}
        <motion.div
          className="absolute inset-x-0 top-0 z-10 mx-auto mt-24 flex w-full max-w-7xl items-start justify-between px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute md:mt-28 md:px-8"
          style={{ opacity: hudOpacity }}
        >
          <div className="space-y-1">
            <p>EW-01 / Assembly sequence</p>
            <p className="text-paper">
              <span className="text-brand">●</span> {STAGES[stage].title}
            </p>
          </div>
          <div className="text-right">
            <p>Build</p>
            <p className="font-display text-3xl tracking-normal text-paper md:text-5xl">
              <Counter p={p} />
              <span className="text-brand">%</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] bg-gradient-to-l from-ink/90 via-ink/50 to-transparent lg:block"
          style={{ opacity: hudOpacity }}
        />

        {/* Stage → service rail */}
        <motion.ol
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 space-y-3 md:right-8 lg:block"
          style={{ opacity: hudOpacity }}
        >
          {STAGES.map((s, i) => (
            <li key={s.title} className="flex items-center justify-end gap-3 text-right">
              <div className={`transition-all duration-500 ${i === stage ? 'opacity-100' : 'opacity-30'}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">{s.service}</p>
                <p className={`font-display text-sm transition-colors ${i === stage ? 'text-paper' : 'text-paper/60'}`}>{s.title}</p>
              </div>
              <span
                className={`h-px transition-all duration-500 ${i === stage ? 'w-10 bg-brand' : i < stage ? 'w-5 bg-white/50' : 'w-5 bg-white/15'}`}
              />
            </li>
          ))}
        </motion.ol>

        {/* Mobile: current service only */}
        <motion.div
          className="absolute inset-x-4 bottom-14 z-10 text-center lg:hidden"
          style={{ opacity: hudOpacity }}
        >
          <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">{STAGES[stage].service}</p>
            <p className="font-display text-lg text-paper">{STAGES[stage].title}</p>
          </motion.div>
        </motion.div>

        {/* Headlines */}
        <div className="absolute inset-x-0 top-0 z-10 mx-auto mt-40 w-full max-w-7xl px-4 md:mt-48 md:px-8">
          <motion.div style={{ opacity: introOpacity, y: introY, filter: introBlur }}>
            <motion.h1
              className="font-display text-[13vw] leading-[0.85] tracking-tight text-paper md:text-[8vw]"
              initial={{ opacity: 0, y: 40 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Built part
              <br />
              <span className="text-outline">by part.</span>
            </motion.h1>
            <motion.p
              className="mt-5 max-w-md text-sm text-paper/70 md:text-base"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : undefined}
              transition={{ delay: 0.5, duration: 1 }}
            >
              European service & performance in Pompano Beach. Scroll to watch every system come together — the way we
              treat yours.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY, pointerEvents: finalePointer }}
          className="absolute inset-x-4 top-28 z-10 text-center md:inset-x-8 md:top-32"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-brand">Eurowerks Automotive</p>
          <h2 className="mt-3 font-display text-[9vw] leading-[0.9] text-paper md:text-[5.5vw]">
            Every part. Every system.
            <br />
            <span className="text-shine">Mastered.</span>
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="#contact" variant="primary">
              Book your service
            </MagneticButton>
            <MagneticButton href="#services" variant="ghost">
              Explore services
            </MagneticButton>
          </div>
        </motion.div>

        {/* HUD — bottom */}
        <motion.div
          className="absolute inset-x-0 bottom-5 z-10 mx-auto flex w-full max-w-7xl items-center gap-4 px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute md:px-8"
          style={{ opacity: hudOpacity }}
        >
          <span className="hidden sm:inline">Scroll</span>
          <div className="relative h-px flex-1 bg-white/10">
            <motion.div className="absolute inset-0 origin-left bg-brand" style={{ scaleX: progressScale }} />
            {STAGES.map((s) => (
              <span
                key={s.title}
                className="absolute -top-1 h-2 w-px bg-white/30"
                style={{ left: `${(s.frame / (FRAME_COUNT - 1)) * 100}%` }}
              />
            ))}
          </div>
          <span>Pompano Beach · FL</span>
        </motion.div>
      </div>
    </section>
  )
}
