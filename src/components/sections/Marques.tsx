import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { marques } from '../../data/site'
import { Eyebrow, RevealText } from '../ui/Reveal'

// Only marques we have real shop photos for get a hover image.
const images: Record<string, string> = {
  BMW: '/images/bmw-m4-csl-front.webp',
  Audi: '/images/audi-r8-spyder.webp',
  'Mercedes-Benz': '/images/sl-r8-duo.webp',
  Porsche: '/images/porsche-911-classic.webp',
  'Rolls-Royce': '/images/rolls-cullinan.webp',
}

export function Marques() {
  return (
    <section id="marques" className="relative bg-ink px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Eyebrow>Specialists in</Eyebrow>
        <RevealText
          text="Seven marques. One standard."
          className="mt-6 font-display text-4xl text-paper md:text-6xl"
        />
        <ul className="mt-14 border-t border-line">
          {marques.map((m, i) => (
            <motion.li
              key={m}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-b border-line"
            >
              <a href="#contact" className="relative flex items-center justify-between gap-6 overflow-hidden py-6 md:py-8">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
                <span className="relative flex items-baseline gap-6">
                  <span className="font-mono text-xs text-mute transition-colors group-hover:text-white/70">
                    0{i + 1}
                  </span>
                  <span className="font-display text-3xl text-paper transition-transform duration-500 group-hover:translate-x-4 md:text-6xl">
                    {m}
                  </span>
                </span>
                {images[m] && (
                  <span className="pointer-events-none absolute left-1/2 hidden h-24 w-36 -translate-x-1/2 overflow-hidden rounded-xl opacity-0 transition-all duration-500 group-hover:opacity-100 md:block">
                    <img src={images[m]} alt="" loading="lazy" className="h-full w-full scale-125 object-cover transition-transform duration-700 group-hover:scale-100" />
                  </span>
                )}
                <span className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-mute transition-colors group-hover:text-white">
                  <span className="hidden sm:inline">Service</span>
                  <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
