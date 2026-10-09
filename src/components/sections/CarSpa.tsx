import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Eyebrow } from '../ui/Reveal'

const STEPS = [
  {
    title: 'Arrival',
    body: 'Your car is checked in, walked around and documented before a single tool touches it.',
    image: 'images/shop-exterior-r8.webp',
  },
  {
    title: 'Diagnosis',
    body: 'Dealer-level diagnostics, and a technician who explains every finding in plain language.',
    image: 'images/bmw-m-bay.webp',
  },
  {
    title: 'The Work',
    body: 'Factory procedure, quality parts, everything torqued to spec. No shortcuts, ever.',
    image: 'images/porsche-gt2rs-exhaust.webp',
  },
  {
    title: 'The Spa',
    body: 'Every car is treated like the collector piece it is — cleaned, inspected and presented before handover.',
    image: 'images/audi-r8-chameleon.webp',
  },
  {
    title: 'Handover',
    body: 'A transparent walkthrough of what was done and why. Then the keys go back to you.',
    image: 'images/sl-r8-duo.webp',
  },
]

export function CarSpa() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)))
  })
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1])

  return (
    <section id="spa" ref={ref} className="relative bg-ink-2" style={{ height: `${STEPS.length * 90}vh` }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8">
          <div className="order-2 md:order-1">
            <Eyebrow>The Eurowerks Experience</Eyebrow>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] text-paper md:text-6xl">
              Not a repair shop.
              <br />
              <span className="text-brand">A car spa.</span>
            </h2>

            <ol className="mt-10 space-y-1">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative border-l border-white/10 pl-6">
                  {i === active && (
                    <motion.span layoutId="spa-active" className="absolute -left-px top-0 h-full w-px bg-brand" />
                  )}
                  <button
                    className="flex w-full items-baseline gap-4 py-2 text-left"
                    onClick={() => {
                      const el = ref.current
                      if (!el) return
                      const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / STEPS.length)
                      window.scrollTo({ top, behavior: 'smooth' })
                    }}
                  >
                    <span className="font-mono text-xs text-mute">0{i + 1}</span>
                    <span
                      className={`font-display text-xl transition-colors duration-500 md:text-2xl ${i === active ? 'text-paper' : 'text-paper/25'}`}
                    >
                      {s.title}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {i === active && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-md overflow-hidden pb-3 pl-9 text-sm leading-relaxed text-paper/60"
                      >
                        {s.body}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-3xl md:order-2 md:aspect-[4/5]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              >
                <motion.img
                  src={STEPS[active].image}
                  alt={STEPS[active].title}
                  className="h-full w-full object-cover"
                  style={{ scale: imgScale }}
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <p className="font-display text-5xl text-paper md:text-7xl">0{active + 1}</p>
              <div className="h-px w-1/2 bg-white/20">
                <motion.div className="h-full origin-left bg-brand" style={{ scaleX: bar }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
