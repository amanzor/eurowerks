import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Eyebrow } from '../ui/Reveal'

const TEXT =
  'Eurowerks is a European repair facility built on factory-matching service. Trained technicians, proper procedures, quality parts and an obsessive eye for detail — delivered with a friendly, transparent experience you can trust.'

function Word({ word, range, p }: { word: string; range: [number, number]; p: MotionValue<number> }) {
  const opacity = useTransform(p, range, [0.12, 1])
  const highlight = /factory-matching|obsessive|trust\./i.test(word)
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span style={{ opacity }} className={highlight ? 'text-brand' : undefined}>
        {word}
      </motion.span>
    </span>
  )
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.45'] })
  const words = TEXT.split(' ')

  return (
    <section className="relative bg-ink px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>About Eurowerks</Eyebrow>
        <div ref={ref} className="mt-10 font-display text-3xl leading-[1.15] md:text-6xl">
          {words.map((w, i) => (
            <Word key={i} word={w} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </div>
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {[
            ['7', 'European marques serviced'],
            ['14', 'South Florida cities served'],
            ['1', 'Standard: factory-matched'],
          ].map(([n, l]) => (
            <div key={l} className="bg-ink p-8">
              <p className="font-display text-6xl text-paper">{n}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mute">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
