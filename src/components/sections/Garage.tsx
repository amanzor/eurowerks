import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { photos } from '../../data/gallery'
import { gallery } from '../../data/site'
import { Eyebrow } from '../ui/Reveal'

const photoCount = photos.length

export function Garage() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  useEffect(() => {
    const measure = () => {
      const el = track.current
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 48))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const x = useTransform(smooth, [0, 1], [0, -distance])
  // Cards lean into the direction of travel, like they have inertia.
  const velocity = useVelocity(scrollYProgress)
  const skew = useSpring(useTransform(velocity, [-1, 0, 1], [5, 0, -5], { clamp: true }), { stiffness: 200, damping: 40 })

  return (
    <section id="garage" ref={ref} className="relative h-[420vh] bg-ink">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-4 md:px-8">
          <div>
            <Eyebrow>From the garage</Eyebrow>
            <h2 className="mt-5 font-display text-4xl text-paper md:text-6xl">Recently on our lifts</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-paper/55 md:block">
            Real cars, real work — straight from the Eurowerks shop floor in Pompano Beach.
          </p>
        </div>

        <motion.div ref={track} style={{ x, skewX: skew }} className="flex w-max gap-5 pl-4 md:gap-8 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {gallery.map((g, i) => (
            <figure
              key={g.src}
              className={`group relative shrink-0 overflow-hidden rounded-3xl ${i % 3 === 1 ? 'mt-16 h-[46svh] w-[72vw] md:w-[34vw]' : 'h-[56svh] w-[78vw] md:w-[28vw]'}`}
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                <span className="font-display text-lg text-paper">{g.caption}</span>
                <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
          <a
            href="gallery.html"
            className="group relative grid h-[56svh] w-[78vw] shrink-0 place-items-center overflow-hidden rounded-3xl border border-white/10 bg-ink-2 md:w-[28vw]"
          >
            <div className="absolute inset-0 grid grid-cols-2 gap-1 opacity-30 transition-opacity duration-700 group-hover:opacity-50">
              {['bmw-m2', 'huracan-black', 'audi-r8-engine-glass', 'bmw-m4-frozen'].map((f) => (
                <img key={f} src={`images/thumbs/${f}.webp`} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
              ))}
            </div>
            <div className="absolute inset-0 bg-ink/60" />
            <div className="relative text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-brand">{photoCount} photos</p>
              <p className="mt-3 font-display text-3xl text-paper md:text-4xl">View the full gallery</p>
              <span className="mx-auto mt-6 grid size-14 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
