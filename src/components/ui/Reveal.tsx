import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

/** Word-by-word masked headline reveal. */
export function RevealText({
  text,
  className,
  as: Tag = 'h2',
  delay = 0,
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  delay?: number
}) {
  const MotionTag = motion[Tag]
  const words = text.split(' ')
  return (
    <MotionTag
      className={cn('flex flex-wrap', className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em]" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0 } }}
            transition={{ duration: 0.9, ease }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-brand">
      <span className="h-px w-8 bg-brand" />
      {children}
    </p>
  )
}
