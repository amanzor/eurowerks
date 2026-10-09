import { marques } from '../../data/site'

export function MarqueBand() {
  const items = [...marques, ...marques]
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-2 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-2 to-transparent" />
      <div className="marquee flex w-max items-center gap-12" style={{ ['--duration' as string]: '32s' }}>
        {[...items, ...items].map((m, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl uppercase tracking-wide text-paper/80 md:text-4xl">
            {m}
            <span className="size-2 rotate-45 bg-brand" />
          </span>
        ))}
      </div>
    </div>
  )
}
