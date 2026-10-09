import { useRef, useState, type ReactNode } from 'react'
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
import * as G from './carGeometry'
import { MagneticButton } from '../ui/MagneticButton'

const easeOut = cubicBezier(0.16, 1, 0.3, 1)

type From = { x?: number; y?: number; r?: number; s?: number }

/** Timeline for each part: [start, end] in scroll progress (0 → 1). */
const T = {
  chassis: [0.12, 0.22],
  suspension: [0.18, 0.27],
  engine: [0.22, 0.32],
  interior: [0.28, 0.36],
  wheels: [0.3, 0.42],
  brakes: [0.36, 0.44],
  bodyFront: [0.42, 0.52],
  bodyMid: [0.45, 0.55],
  bodyRear: [0.48, 0.58],
  glass: [0.54, 0.6],
  aero: [0.56, 0.63],
  wing: [0.59, 0.66],
  exhaust: [0.61, 0.67],
  lights: [0.64, 0.7],
  paint: [0.7, 0.8],
  ignite: [0.8, 0.84],
  finale: [0.84, 0.92],
} as const

const STAGES: { at: number; label: string }[] = [
  { at: 0, label: 'Blueprint' },
  { at: T.chassis[0], label: 'Carbon monocoque' },
  { at: T.suspension[0], label: 'Suspension' },
  { at: T.engine[0], label: 'Twin-turbo V8' },
  { at: T.wheels[0], label: 'Wheels & alignment' },
  { at: T.brakes[0], label: 'Carbon-ceramic brakes' },
  { at: T.bodyFront[0], label: 'Body panels' },
  { at: T.glass[0], label: 'Glass' },
  { at: T.aero[0], label: 'Aero & exhaust' },
  { at: T.lights[0], label: 'Lighting & sensors' },
  { at: T.paint[0], label: 'Paint & ceramic' },
  { at: T.ignite[0], label: 'Ignition' },
]

const CALLOUTS: {
  range: readonly [number, number]
  x: number
  y: number
  dir: 'up' | 'down'
  title: string
  service: string
}[] = [
  { range: T.chassis, x: 300, y: 318, dir: 'down', title: 'Carbon monocoque', service: 'Pre-purchase inspection' },
  { range: T.suspension, x: 292, y: 250, dir: 'up', title: 'Coil-over suspension', service: 'Suspension upgrades' },
  { range: T.engine, x: 950, y: 220, dir: 'up', title: 'Twin-turbo V8', service: 'ECU tuning' },
  { range: T.wheels, x: 292, y: 392, dir: 'down', title: 'Forged wheels', service: 'Precision alignment' },
  { range: T.brakes, x: 912, y: 300, dir: 'down', title: 'Carbon-ceramic brakes', service: 'Brake systems' },
  { range: T.bodyMid, x: 680, y: 290, dir: 'down', title: 'Factory-matched body', service: 'Maintenance to spec' },
  { range: T.exhaust, x: 1090, y: 330, dir: 'down', title: 'Valved exhaust', service: 'Exhaust systems' },
  { range: T.lights, x: 200, y: 272, dir: 'up', title: 'Lights, radar, cameras', service: 'ADAS calibration' },
  { range: T.paint, x: 560, y: 250, dir: 'up', title: 'Paint correction', service: 'The car spa' },
]

function usePart(p: MotionValue<number>, [s, e]: readonly [number, number], from: From) {
  const x = useTransform(p, [s, e], [from.x ?? 0, 0], { ease: easeOut })
  const y = useTransform(p, [s, e], [from.y ?? 0, 0], { ease: easeOut })
  const rotate = useTransform(p, [s, e], [from.r ?? 0, 0], { ease: easeOut })
  const scale = useTransform(p, [s, e], [from.s ?? 1, 1], { ease: easeOut })
  const opacity = useTransform(p, [s, s + (e - s) * 0.3], [0, 1])
  return { x, y, rotate, scale, opacity }
}

function Part({
  p,
  range,
  from,
  children,
}: {
  p: MotionValue<number>
  range: readonly [number, number]
  from: From
  children: ReactNode
}) {
  const style = usePart(p, range, from)
  return (
    <motion.g style={{ ...style, transformBox: 'fill-box', transformOrigin: 'center' }}>
      {children}
    </motion.g>
  )
}

function Wheel({
  p,
  cx,
  cy,
  fromX,
  delay,
}: {
  p: MotionValue<number>
  cx: number
  cy: number
  fromX: number
  delay: number
}) {
  const [s, e] = [T.wheels[0] + delay, T.wheels[1] + delay]
  const x = useTransform(p, [s, e], [fromX, 0], { ease: easeOut })
  const opacity = useTransform(p, [s, s + 0.02], [0, 1])
  // Roll naturally: rotation follows distance travelled.
  const spin = useTransform(x, (v) => (v / G.TIRE_R) * (180 / Math.PI))
  const calY = useTransform(p, [T.brakes[0] + delay, T.brakes[1] + delay], [-140, 0], { ease: easeOut })
  const calO = useTransform(p, [T.brakes[0] + delay, T.brakes[0] + delay + 0.02], [0, 1])

  const spokes = Array.from({ length: 5 }, (_, i) => (i * 360) / 5)

  return (
    <motion.g style={{ x, opacity }}>
      {/* tire */}
      <circle cx={cx} cy={cy} r={G.TIRE_R} fill="url(#tire)" />
      <circle cx={cx} cy={cy} r={G.TIRE_R - 3} fill="none" stroke="#2b2d31" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={G.RIM_R + 4} fill="#0b0b0c" />
      <motion.g style={{ rotate: spin, transformBox: 'fill-box', transformOrigin: 'center' }}>
        {/* drilled carbon-ceramic disc */}
        <circle cx={cx} cy={cy} r={38} fill="url(#disc)" />
        <circle cx={cx} cy={cy} r={31} fill="none" stroke="#5a5d63" strokeWidth={1} strokeDasharray="2 5" />
        <circle cx={cx} cy={cy} r={24} fill="none" stroke="#5a5d63" strokeWidth={1} strokeDasharray="2 6" />
      </motion.g>
      {/* caliper drops in separately */}
      <motion.g style={{ y: calY, opacity: calO }}>
        <path
          d={`M ${cx + 14} ${cy - 40} A 42 42 0 0 1 ${cx + 41} ${cy - 8} L ${cx + 30} ${cy - 4} A 32 32 0 0 0 ${cx + 10} ${cy - 29} Z`}
          fill="url(#caliper)"
        />
        <text
          x={cx + 26}
          y={cy - 20}
          fontSize={5}
          fill="#fff"
          fontFamily="var(--font-mono)"
          transform={`rotate(48 ${cx + 26} ${cy - 20})`}
          letterSpacing={0.6}
        >
          EW
        </text>
      </motion.g>
      <motion.g style={{ rotate: spin, transformBox: 'fill-box', transformOrigin: 'center' }}>
        {/* forged twin-spoke rim */}
        <circle cx={cx} cy={cy} r={G.RIM_R} fill="none" stroke="#1e1f23" strokeWidth={6} />
        <circle cx={cx} cy={cy} r={G.RIM_R + 2} fill="none" stroke="url(#rim)" strokeWidth={2} />
        {spokes.map((a) => (
          <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
            {[-1, 1].map((side) => (
              <path
                key={side}
                d={`M ${cx + side * 2} ${cy - 10} L ${cx + side * 4} ${cy - G.RIM_R + 3} L ${cx + side * 12} ${cy - G.RIM_R + 4} L ${cx + side * 5.5} ${cy - 10} Z`}
                fill="url(#spoke)"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={0.6}
              />
            ))}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={13} fill="url(#hub)" stroke="#0c0c0e" strokeWidth={1.5} />
        {spokes.map((a) => (
          <circle key={a} cx={cx} cy={cy - 7.5} r={1.4} fill="#0c0c0e" transform={`rotate(${a + 36} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r={3.6} fill="var(--color-brand)" />
      </motion.g>
    </motion.g>
  )
}

function Callout({
  p,
  c,
}: {
  p: MotionValue<number>
  c: (typeof CALLOUTS)[number]
}) {
  const [s] = c.range
  const end = Math.min(s + 0.16, T.paint[1] + 0.02)
  const opacity = useTransform(p, [s, s + 0.03, end - 0.03, end], [0, 1, 1, 0])
  const lineScale = useTransform(p, [s, s + 0.04], [0, 1])
  const up = c.dir === 'up'
  return (
    <motion.div
      className="pointer-events-none absolute hidden md:block"
      style={{ left: `${(c.x / G.VIEW_W) * 100}%`, top: `${(c.y / G.VIEW_H) * 100}%`, opacity }}
    >
      <span className="absolute -left-[5px] -top-[5px] size-[10px] rounded-full border border-brand bg-brand/30">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/50" />
      </span>
      <motion.span
        className={`absolute left-0 w-px bg-gradient-to-b from-brand to-white/20 ${up ? 'bottom-0 origin-bottom' : 'top-0 origin-top'}`}
        style={{ height: 72, scaleY: lineScale }}
      />
      <div
        className={`absolute left-3 w-max ${up ? 'bottom-[64px]' : 'top-[64px]'} border-l border-brand/70 bg-ink/70 px-3 py-2 backdrop-blur-md`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">{c.service}</p>
        <p className="font-display text-sm text-paper">{c.title}</p>
      </div>
    </motion.div>
  )
}

function Counter({ p }: { p: MotionValue<number> }) {
  const text = useTransform(p, (v) => String(Math.round(Math.min(1, v / T.ignite[1]) * 100)).padStart(3, '0'))
  return <motion.span>{text}</motion.span>
}

export function CarAssembly({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 160, damping: 34, mass: 0.35 })
  const done = useMotionValue(1)
  const p = reduce ? done : smooth

  const [stage, setStage] = useState(STAGES[0].label)
  useMotionValueEvent(p, 'change', (v) => {
    let label = STAGES[0].label
    for (const s of STAGES) if (v >= s.at) label = s.label
    setStage((prev) => (prev === label ? prev : label))
  })

  // Scene-level motion
  const introOpacity = useTransform(p, [0, 0.08], [1, 0])
  const introY = useTransform(p, [0, 0.1], [0, -60])
  const introBlur = useTransform(p, [0, 0.08], ['blur(0px)', 'blur(12px)'])
  const finaleOpacity = useTransform(p, [T.finale[0], T.finale[1]], [0, 1])
  const finaleY = useTransform(p, [T.finale[0], T.finale[1]], [40, 0], { ease: easeOut })
  const finalePointer = useTransform(p, (v) => (v > T.finale[0] + 0.02 ? 'auto' : 'none'))
  const carScale = useTransform(p, [0, 0.12, 0.7, T.ignite[1], 1], [0.86, 1, 1, 1.05, 1.02])
  const carY = useTransform(p, [0, 0.12, T.finale[0], 1], [60, 0, 0, 24])
  const blueprintOpacity = useTransform(p, [0, 0.62, 0.74], [1, 0.9, 0])
  const gridOpacity = useTransform(p, [0, 0.7, 0.82], [0.55, 0.4, 0.08])
  const hudOpacity = useTransform(p, [0, 0.04, 0.84, 0.9], [0.6, 1, 1, 0])
  const progressScale = useTransform(p, [0, T.ignite[1]], [0, 1])
  const mechOpacity = useTransform(p, [T.bodyRear[1], T.glass[1]], [1, 0])

  // Paint + ignition
  const paintX = useTransform(p, [T.paint[0], T.paint[1]], [-1300, 0], { ease: cubicBezier(0.65, 0, 0.35, 1) })
  const sheenX = useTransform(p, [T.paint[0] + 0.03, T.paint[1] + 0.04], [-500, 1400])
  const lightsOn = useTransform(p, [T.ignite[0], T.ignite[0] + 0.01, T.ignite[0] + 0.015, T.ignite[0] + 0.02, T.ignite[1]], [0, 1, 0.2, 1, 1])
  const glowOpacity = useTransform(p, [T.ignite[0], T.finale[1]], [0, 1])
  const beamOpacity = useTransform(p, [T.ignite[0] + 0.02, T.ignite[1]], [0, 0.45])
  const shadowOpacity = useTransform(p, [T.wheels[0], T.wheels[1]], [0, 1])

  return (
    <section ref={ref} id="top" className="relative h-[640vh] bg-ink" aria-label="Eurowerks — car assembly">
      <div className="sticky top-0 flex h-svh w-full flex-col overflow-hidden">
        {/* Backdrop */}
        <motion.div className="blueprint-grid absolute inset-0" style={{ opacity: gridOpacity }} />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_50%_80%,rgba(215,38,46,0.35),transparent_60%)]"
          style={{ opacity: glowOpacity }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,6,0.9)_100%)]" />

        {/* Speed streaks after ignition */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: glowOpacity }}>
          {[22, 38, 61, 74, 83].map((top, i) => (
            <span
              key={top}
              className="streak absolute h-px w-[40vw] bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ top: `${top}%`, animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </motion.div>

        {/* HUD — top */}
        <motion.div
          className="relative z-10 mx-auto mt-24 flex w-full max-w-7xl items-start justify-between px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute md:mt-28 md:px-8"
          style={{ opacity: hudOpacity }}
        >
          <div className="space-y-1">
            <p>EW-01 / Assembly sequence</p>
            <p className="text-paper">
              <span className="text-brand">●</span> {stage}
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

        {/* Headlines */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
          <motion.div style={{ opacity: introOpacity, y: introY, filter: introBlur }} className="absolute inset-x-4 top-4 md:inset-x-8">
            <motion.h1
              className="font-display text-[13vw] leading-[0.85] tracking-tight text-paper md:text-[8.5vw]"
              initial={{ opacity: 0, y: 40 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Built part
              <br />
              <span className="text-outline">by part.</span>
            </motion.h1>
            <motion.p
              className="mt-5 max-w-md text-sm text-mute md:text-base"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : undefined}
              transition={{ delay: 0.5, duration: 1 }}
            >
              European service & performance in Pompano Beach. Scroll to watch every system come together — the
              way we treat yours.
            </motion.p>
          </motion.div>

          <motion.div
            style={{ opacity: finaleOpacity, y: finaleY, pointerEvents: finalePointer }}
            className="absolute inset-x-4 top-2 text-center md:inset-x-8"
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
        </div>

        {/* The car */}
        <div className="relative z-0 mt-auto mb-[24vh] w-full md:mb-[10vh]">
          <motion.div
            className="relative mx-auto w-[104vw] -translate-x-[2vw] max-w-[1280px] md:w-[92vw] md:translate-x-0"
            style={{ scale: carScale, y: carY, aspectRatio: `${G.VIEW_W} / ${G.VIEW_H}` }}
          >
            <svg viewBox={`0 0 ${G.VIEW_W} ${G.VIEW_H}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="A supercar assembling itself">
              <Defs />

              {/* Ground */}
              <line x1={-200} x2={1400} y1={G.GROUND_Y} y2={G.GROUND_Y} stroke="url(#groundLine)" strokeWidth={1} />
              <motion.ellipse cx={602} cy={G.GROUND_Y + 2} rx={560} ry={16} fill="url(#shadow)" style={{ opacity: shadowOpacity }} />
              <motion.ellipse cx={602} cy={G.GROUND_Y + 4} rx={620} ry={30} fill="url(#underglow)" style={{ opacity: glowOpacity }} />

              {/* Blueprint wireframe */}
              <Blueprint ready={ready || !!reduce} opacity={blueprintOpacity} />

              {/* Mechanical layer: fades once the body is closed */}
              <motion.g style={{ opacity: mechOpacity }}>
                <Part p={p} range={T.chassis} from={{ y: 260, s: 0.9 }}>
                  <path d={G.MONOCOQUE} fill="url(#carbon)" stroke="#3a3c41" strokeWidth={1} />
                  {G.ROLL_CAGE.map((d) => (
                    <path key={d} d={d} fill="none" stroke="#6b6f76" strokeWidth={4} strokeLinecap="round" />
                  ))}
                </Part>
                <Part p={p} range={T.suspension} from={{ y: -220 }}>
                  {[G.FRONT_WHEEL, G.REAR_WHEEL].map((w) => {
                    const c = G.coilover(w.cx, w.cy)
                    return (
                      <g key={w.cx}>
                        <path d={c.arm} fill="none" stroke="#8a8f97" strokeWidth={5} strokeLinecap="round" />
                        <path d={c.damper} fill="#c9cdd3" />
                        <path d={c.spring} fill="none" stroke="var(--color-brand)" strokeWidth={4} strokeLinejoin="round" />
                      </g>
                    )
                  })}
                </Part>
                <Part p={p} range={T.engine} from={{ y: -320, r: -8 }}>
                  <path d={G.ENGINE_BLOCK} fill="url(#engine)" stroke="#55585e" />
                  {G.ENGINE_DETAILS.map((d) => (
                    <path key={d} d={d} stroke="#2b2d31" strokeWidth={3} />
                  ))}
                  {G.ENGINE_INTAKE_RUNNERS.map((d) => (
                    <path key={d} d={d} fill="none" stroke="#c9cdd3" strokeWidth={5} strokeLinecap="round" />
                  ))}
                  {[880, 990].map((x) => (
                    <g key={x}>
                      <circle cx={x} cy={282} r={14} fill="url(#turbo)" />
                      <path d={`M ${x} 282 m -8 0 a 8 8 0 1 1 8 8 a 5 5 0 1 1 -5 -5`} fill="none" stroke="#5a3214" strokeWidth={1.5} />
                    </g>
                  ))}
                </Part>
                <Part p={p} range={T.interior} from={{ x: -260, y: -60 }}>
                  <path d={G.SEAT} fill="#2a1416" stroke="var(--color-brand)" strokeWidth={1.5} />
                  <circle cx={G.STEERING_WHEEL.cx} cy={G.STEERING_WHEEL.cy} r={G.STEERING_WHEEL.r} fill="none" stroke="#c9cdd3" strokeWidth={4} />
                </Part>
              </motion.g>

              {/* Body panels — one silhouette split into three clipped panels */}
              <BodyPanel p={p} range={T.bodyFront} from={{ x: -520, y: -60, r: -6 }} clip="clipFront" />
              <BodyPanel p={p} range={T.bodyMid} from={{ y: -360 }} clip="clipMid" />
              <BodyPanel p={p} range={T.bodyRear} from={{ x: 560, y: -80, r: 6 }} clip="clipRear" />

              {/* Paint wipe */}
              <g clipPath="url(#clipPaint)">
                <path d={G.BODY} fill="url(#paint)" />
                <path d={G.BODY} fill="url(#paintShade)" />
                <path d={G.SHOULDER_HIGHLIGHT} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={6} filter="url(#soft)" />
                <g clipPath="url(#clipBody)">
                  <motion.rect y={0} width={260} height={G.VIEW_H} fill="url(#sheen)" style={{ x: sheenX }} />
                </g>
              </g>
              <defs>
                <clipPath id="clipPaint">
                  <motion.rect y={-20} width={1300} height={G.VIEW_H + 40} x={paintX} />
                </clipPath>
              </defs>

              {/* Body detailing that sits on top of paint */}
              <Part p={p} range={T.bodyFront} from={{ x: -520, y: -60, r: -6 }}>
                <path d={G.FRONT_INTAKE} fill="#060607" stroke="rgba(255,255,255,0.1)" />
              </Part>
              <Part p={p} range={T.bodyMid} from={{ y: -360 }}>
                <path d={G.DOOR_SEAM} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={1.4} />
                <path d={G.CHARACTER_LINE} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.2} />
              </Part>
              <Part p={p} range={T.bodyRear} from={{ x: 560, y: -80, r: 6 }}>
                <path d={G.SIDE_INTAKE} fill="#060607" stroke="rgba(255,255,255,0.12)" />
                {G.INTAKE_FINS.map((d) => (
                  <path key={d} d={d} stroke="#26282c" strokeWidth={3} />
                ))}
                <path d={G.TAILLIGHT} fill="#3a0d10" />
                {/* engine-cover louvres */}
                {G.FASTBACK_LOUVRES.map((d) => (
                  <path key={d} d={d} stroke="rgba(0,0,0,0.65)" strokeWidth={3} strokeLinecap="round" />
                ))}
              </Part>

              {/* Glass */}
              <Part p={p} range={T.glass} from={{ y: -120, s: 1.1 }}>
                <path d={G.SIDE_WINDOW} fill="url(#glass)" stroke="#0a0a0b" strokeWidth={3} />
                <path d="M 590 186 C 630 166 670 158 720 156" stroke="rgba(255,255,255,0.35)" strokeWidth={2} fill="none" strokeLinecap="round" />
                <path d={G.WINDSHIELD_EDGE} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
              </Part>

              {/* Aero */}
              <Part p={p} range={T.aero} from={{ x: -300 }}>
                <path d={G.FRONT_SPLITTER} fill="url(#carbon)" stroke="#2b2d31" />
              </Part>
              <Part p={p} range={T.aero} from={{ y: 120 }}>
                <path d={G.SIDE_SKIRT} fill="url(#carbon)" stroke="#2b2d31" />
              </Part>
              <Part p={p} range={T.aero} from={{ x: 300 }}>
                <path d={G.DIFFUSER} fill="url(#carbon)" stroke="#2b2d31" />
                {G.DIFFUSER_FINS.map((d) => (
                  <path key={d} d={d} stroke="#45484e" strokeWidth={2} />
                ))}
              </Part>
              <Part p={p} range={T.wing} from={{ x: 160, y: -300, r: 24 }}>
                {G.WING_STRUTS.map((d) => (
                  <path key={d} d={d} stroke="#1c1d20" strokeWidth={6} strokeLinecap="round" />
                ))}
                <path d={G.WING} fill="url(#carbon)" stroke="#45484e" />
                <path d={G.WING_ENDPLATE} fill="#111214" stroke="#45484e" />
                <path d="M 954 144 L 1116 150" stroke="var(--color-brand)" strokeWidth={1.5} />
              </Part>
              <Part p={p} range={T.exhaust} from={{ x: 260 }}>
                {G.EXHAUST_TIPS.map((t) => (
                  <g key={t.cx}>
                    <ellipse cx={t.cx} cy={t.cy} rx={t.rx} ry={t.ry} fill="url(#titanium)" />
                    <ellipse cx={t.cx} cy={t.cy} rx={t.rx - 3} ry={t.ry - 2.5} fill="#050506" />
                  </g>
                ))}
              </Part>

              {/* Lights + mirror */}
              <Part p={p} range={T.lights} from={{ x: -200, s: 0.6 }}>
                <path d={G.HEADLIGHT} fill="#15171b" stroke="rgba(255,255,255,0.25)" />
                <path d={G.HEADLIGHT_DRL} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
              </Part>
              <Part p={p} range={T.lights} from={{ y: -140, r: -30 }}>
                <path d={G.MIRROR_STALK} stroke="#0d0d0f" strokeWidth={5} />
                <path d={G.MIRROR} fill="#121315" stroke="rgba(255,255,255,0.15)" />
              </Part>

              {/* Ignition */}
              <motion.g style={{ opacity: lightsOn }}>
                <path d={G.HEADLIGHT_DRL} fill="none" stroke="#e9f4ff" strokeWidth={3} filter="url(#glow)" />
                <path d={G.HEADLIGHT} fill="rgba(220,236,255,0.55)" />
                <path d={G.TAILLIGHT} fill="#ff2d3a" filter="url(#glow)" />
                <path d="M 1086 222 L 1100 226" stroke="#ffd6d8" strokeWidth={1.5} />
              </motion.g>
              <motion.path
                d="M 160 290 L -220 236 L -220 360 Z"
                fill="url(#beam)"
                filter="url(#beamBlur)"
                style={{ opacity: beamOpacity }}
              />

              <Wheel p={p} cx={G.FRONT_WHEEL.cx} cy={G.FRONT_WHEEL.cy} fromX={-900} delay={0} />
              <Wheel p={p} cx={G.REAR_WHEEL.cx} cy={G.REAR_WHEEL.cy} fromX={900} delay={0.02} />
            </svg>

            {CALLOUTS.map((c) => (
              <Callout key={c.title} p={p} c={c} />
            ))}
          </motion.div>
        </div>

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
                key={s.label}
                className="absolute -top-1 h-2 w-px bg-white/30"
                style={{ left: `${(s.at / T.ignite[1]) * 100}%` }}
              />
            ))}
          </div>
          <span>Pompano Beach · FL</span>
        </motion.div>
      </div>
    </section>
  )
}

function BodyPanel({
  p,
  range,
  from,
  clip,
}: {
  p: MotionValue<number>
  range: readonly [number, number]
  from: From
  clip: string
}) {
  return (
    <Part p={p} range={range} from={from}>
      <g clipPath={`url(#${clip})`}>
        <path d={G.BODY} fill="url(#primer)" />
        <path d={G.BODY} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} />
      </g>
    </Part>
  )
}

function Blueprint({ ready, opacity }: { ready: boolean; opacity: MotionValue<number> }) {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: ready ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { duration: 2.2, delay, ease: [0.65, 0, 0.35, 1] as const },
  })
  const stroke = { fill: 'none', stroke: 'rgba(120,170,255,0.55)', strokeWidth: 1 }
  return (
    <motion.g style={{ opacity }}>
      <motion.path d={G.BODY} {...stroke} {...draw(0.1)} />
      <motion.path d={G.SIDE_WINDOW} {...stroke} {...draw(0.5)} />
      <motion.path d={G.DOOR_SEAM} {...stroke} strokeDasharray="4 4" {...draw(0.7)} />
      <motion.path d={G.SIDE_INTAKE} {...stroke} {...draw(0.8)} />
      <motion.path d={G.WING} {...stroke} {...draw(0.9)} />
      <motion.path d={G.HEADLIGHT} {...stroke} {...draw(0.9)} />
      {[G.FRONT_WHEEL, G.REAR_WHEEL].map((w) => (
        <g key={w.cx}>
          <motion.circle cx={w.cx} cy={w.cy} r={G.TIRE_R} {...stroke} {...draw(0.4)} />
          <motion.circle cx={w.cx} cy={w.cy} r={G.RIM_R} {...stroke} strokeDasharray="3 5" {...draw(0.6)} />
          <motion.path d={`M ${w.cx - 80} ${w.cy} L ${w.cx + 80} ${w.cy} M ${w.cx} ${w.cy - 80} L ${w.cx} ${w.cy + 80}`} {...stroke} strokeOpacity={0.4} {...draw(0.6)} />
        </g>
      ))}
      {G.DIMENSIONS.map((dim) => (
        <g key={dim.label}>
          <motion.path d={dim.d} {...stroke} strokeOpacity={0.6} {...draw(1.1)} markerStart="url(#tick)" markerEnd="url(#tick)" />
          <motion.text
            x={dim.x}
            y={dim.y}
            textAnchor="middle"
            fontSize={10}
            letterSpacing={2}
            fill="rgba(120,170,255,0.75)"
            fontFamily="var(--font-mono)"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            {dim.label}
          </motion.text>
        </g>
      ))}
    </motion.g>
  )
}

function Defs() {
  const { front, rear } = G.PANEL_SPLITS
  return (
    <defs>
      <clipPath id="clipFront">
        <rect x={-100} y={-100} width={front + 100} height={G.VIEW_H + 200} />
      </clipPath>
      <clipPath id="clipMid">
        <rect x={front} y={-100} width={rear - front} height={G.VIEW_H + 200} />
      </clipPath>
      <clipPath id="clipRear">
        <rect x={rear} y={-100} width={G.VIEW_W} height={G.VIEW_H + 200} />
      </clipPath>
      <clipPath id="clipBody">
        <path d={G.BODY} />
      </clipPath>

      <linearGradient id="primer" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a3c41" />
        <stop offset="0.5" stopColor="#202125" />
        <stop offset="1" stopColor="#111214" />
      </linearGradient>
      <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ff5a60" />
        <stop offset="0.28" stopColor="#d7262e" />
        <stop offset="0.62" stopColor="#8f1018" />
        <stop offset="1" stopColor="#3b0509" />
      </linearGradient>
      <linearGradient id="paintShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.35" />
        <stop offset="0.25" stopColor="#000" stopOpacity="0" />
        <stop offset="0.8" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b4250" />
        <stop offset="0.45" stopColor="#0d1015" />
        <stop offset="1" stopColor="#05060a" />
      </linearGradient>
      <linearGradient id="carbon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c2e33" />
        <stop offset="1" stopColor="#0c0c0e" />
      </linearGradient>
      <linearGradient id="engine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5d6168" />
        <stop offset="1" stopColor="#1d1e21" />
      </linearGradient>
      <linearGradient id="titanium" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d4d7dc" />
        <stop offset="0.6" stopColor="#6d7178" />
        <stop offset="1" stopColor="#4a5b8a" />
      </linearGradient>
      <radialGradient id="turbo">
        <stop offset="0" stopColor="#e09a5a" />
        <stop offset="1" stopColor="#7a3f16" />
      </radialGradient>
      <radialGradient id="hub">
        <stop offset="0" stopColor="#4a4d53" />
        <stop offset="1" stopColor="#141518" />
      </radialGradient>
      <radialGradient id="tire">
        <stop offset="0.7" stopColor="#141518" />
        <stop offset="0.95" stopColor="#1f2024" />
        <stop offset="1" stopColor="#0a0a0b" />
      </radialGradient>
      <radialGradient id="disc">
        <stop offset="0.3" stopColor="#3a3c41" />
        <stop offset="1" stopColor="#6d7178" />
      </radialGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f2f3f5" />
        <stop offset="0.5" stopColor="#7c8189" />
        <stop offset="1" stopColor="#d9dce0" />
      </linearGradient>
      <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#c3c7cd" />
        <stop offset="0.45" stopColor="#5d6168" />
        <stop offset="1" stopColor="#2a2c31" />
      </linearGradient>
      <linearGradient id="caliper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff4d55" />
        <stop offset="1" stopColor="#a5121a" />
      </linearGradient>
      <radialGradient id="shadow">
        <stop offset="0" stopColor="#000" stopOpacity="0.9" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="underglow">
        <stop offset="0" stopColor="#ff2d3a" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ff2d3a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="groundLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.25" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="beam" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#e6f1ff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#e6f1ff" stopOpacity="0" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="beamBlur" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <marker id="tick" viewBox="0 0 2 10" refX="1" refY="5" markerWidth="2" markerHeight="10" orient="auto">
        <rect width="2" height="10" fill="rgba(120,170,255,0.7)" />
      </marker>
    </defs>
  )
}
