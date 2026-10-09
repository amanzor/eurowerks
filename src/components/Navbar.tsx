import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { business } from '../data/site'
import { cn } from '../lib/cn'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#spa', label: 'The Car Spa' },
  { href: '#garage', label: 'Garage' },
  { href: '#marques', label: 'Marques' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400 && !open)
    setScrolled(y > 40)
  })

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5"
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 md:px-6',
            scrolled ? 'border-white/10 bg-ink/60 backdrop-blur-xl' : 'border-transparent bg-transparent',
          )}
        >
          <a href="#top" aria-label="Eurowerks home" className="shrink-0">
            <img src="/images/logo-wordmark.png" alt="Eurowerks" className="h-4 w-auto md:h-5" />
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative text-sm text-paper/70 transition-colors hover:text-paper">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-brand transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${business.advisors[0].phone}`}
              className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-bright md:inline-flex"
            >
              <Phone className="size-3.5" /> {business.advisors[0].phone}
            </a>
            <button
              className="grid size-10 place-items-center rounded-full border border-white/15 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'circle(0% at 95% 4%)' }}
            animate={{ clipPath: 'circle(150% at 95% 4%)' }}
            exit={{ clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="font-display text-4xl text-paper">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={`tel:${business.advisors[0].phone}`} className="mt-12 font-mono text-sm tracking-widest text-brand">
              {business.advisors[0].phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
