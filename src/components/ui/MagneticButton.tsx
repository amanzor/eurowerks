import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export function MagneticButton({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn(
        'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-colors',
        variant === 'primary'
          ? 'bg-brand text-white shadow-[0_0_40px_-8px_rgba(215,38,46,0.8)]'
          : 'border border-white/15 bg-white/5 text-paper backdrop-blur-md hover:border-white/40',
        className,
      )}
    >
      <span
        className={cn(
          'absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0',
          variant === 'primary' ? 'bg-white' : 'bg-white/10',
        )}
      />
      <span className={cn('relative transition-colors duration-300', variant === 'primary' && 'group-hover:text-ink')}>
        {children}
      </span>
      <ArrowUpRight
        className={cn(
          'relative size-4 transition-all duration-300 group-hover:rotate-45',
          variant === 'primary' && 'group-hover:text-brand',
        )}
      />
    </motion.a>
  )
}
