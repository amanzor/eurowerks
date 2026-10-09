import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { business, serviceAreas } from '../../data/site'
import { MagneticButton } from '../ui/MagneticButton'
import { Eyebrow, FadeIn, RevealText } from '../ui/Reveal'

export function ServiceAreas() {
  return (
    <section className="relative overflow-hidden bg-ink-2 px-4 py-28 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>Service areas</Eyebrow>
          <RevealText
            text="South Florida's go-to stop for European cars."
            className="mt-6 font-display text-3xl leading-[1.1] text-paper md:text-5xl"
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {serviceAreas.map((a, i) => (
              <FadeIn key={a} delay={i * 0.03} y={12}>
                <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-paper/75 transition-colors hover:border-brand hover:text-paper">
                  {a}
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
        <FadeIn className="relative aspect-square overflow-hidden rounded-3xl border border-line">
          <iframe
            title="Eurowerks location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(business.mapsQuery)}&z=12&output=embed`}
            className="h-full w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </FadeIn>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink px-4 py-28 md:px-8 md:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(215,38,46,0.35),transparent_60%)]" />
      <img
        src="/images/huracan-sto.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-luminosity"
        loading="lazy"
      />
      <div className="relative mx-auto max-w-7xl">
        <Eyebrow>Book your appointment</Eyebrow>
        <RevealText
          text="Your car deserves Eurowerks."
          className="mt-6 max-w-4xl font-display text-5xl leading-[1] text-paper md:text-8xl"
        />
        <FadeIn className="mt-10 flex flex-wrap gap-3">
          <MagneticButton href={`tel:${business.advisors[0].phone}`}>Call {business.advisors[0].name}</MagneticButton>
          <MagneticButton href={`mailto:${business.email}`} variant="ghost">
            Email the shop
          </MagneticButton>
        </FadeIn>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={<Phone className="size-4" />} title="Service advisors">
            {business.advisors.map((a) => (
              <a key={a.name} href={`tel:${a.phone}`} className="block hover:text-brand">
                {a.name} · {a.phone}
              </a>
            ))}
          </InfoCard>
          <InfoCard icon={<MapPin className="size-4" />} title="Visit">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand"
            >
              {business.address}
              <br />
              {business.city}
            </a>
          </InfoCard>
          <InfoCard icon={<Clock className="size-4" />} title="Hours">
            {business.hours.map((h) => (
              <p key={h.days}>
                {h.days} · {h.time}
              </p>
            ))}
          </InfoCard>
          <InfoCard icon={<Mail className="size-4" />} title="Email">
            <a href={`mailto:${business.email}`} className="break-all hover:text-brand">
              {business.email}
            </a>
          </InfoCard>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <FadeIn className="rounded-2xl border border-white/10 bg-ink-2/70 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-brand">
        {icon}
        {title}
      </div>
      <div className="mt-4 space-y-1 text-paper/80">{children}</div>
    </FadeIn>
  )
}

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink px-4 pt-16 pb-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 text-sm text-paper/60 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src="/images/logo-wordmark.png" alt="Eurowerks" className="h-6 w-auto" />
            <p className="mt-5 max-w-sm">
              European vehicle service & performance center. BMW, Audi, Mercedes-Benz, Porsche, Land Rover, Rolls-Royce
              and Bentley.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper">Explore</p>
            <ul className="mt-4 space-y-2">
              <li><a href="#services" className="hover:text-paper">Services</a></li>
              <li><a href="#spa" className="hover:text-paper">The Car Spa</a></li>
              <li><a href="#garage" className="hover:text-paper">Garage</a></li>
              <li><a href="#contact" className="hover:text-paper">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper">Shop</p>
            <p className="mt-4">{business.address}</p>
            <p>{business.city}</p>
            <p className="mt-2">Mon–Fri 8am–6pm</p>
          </div>
        </div>
        <p
          aria-hidden
          className="mt-16 select-none text-center font-display text-[17vw] leading-none tracking-tighter text-transparent"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.12)' }}
        >
          EUROWERKS
        </p>
        <div className="mt-6 flex flex-col justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:flex-row">
          <span>© {YEAR} Eurowerks Automotive</span>
          <span>Pompano Beach · Florida</span>
        </div>
      </div>
    </footer>
  )
}
