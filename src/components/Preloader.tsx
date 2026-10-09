import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.76, 0, 0.24, 1] as const

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const start = performance.now()
    const duration = 1600
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration)
      setCount(Math.round((1 - Math.pow(1 - k, 3)) * 100))
      if (k < 1) raf = requestAnimationFrame(tick)
      else
        setTimeout(() => {
          setVisible(false)
          document.documentElement.style.overflow = ''
        }, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 md:p-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-mute">
            <span>Eurowerks Automotive</span>
            <span>Pompano Beach · FL</span>
          </div>
          <div className="overflow-hidden">
            <motion.img
              src="images/logo-wordmark.png"
              alt="Eurowerks"
              className="mx-auto w-[min(80vw,640px)]"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease }}
            />
          </div>
          <div className="flex items-end justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute">Warming up</span>
            <span className="font-display text-6xl tabular-nums text-paper md:text-8xl">
              {count}
              <span className="text-brand">%</span>
            </span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-brand"
            style={{ width: `${count}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
