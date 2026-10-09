import { business } from '../../data/site'
import { cn } from '../../lib/cn'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-4" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z" />
    </svg>
  )
}

export function SocialLinks({ className }: { className?: string }) {
  const links = [
    { href: business.socials.instagram, label: 'Eurowerks on Instagram', icon: <InstagramIcon /> },
    { href: business.socials.facebook, label: 'Eurowerks on Facebook', icon: <FacebookIcon /> },
  ]
  return (
    <div className={cn('flex gap-2', className)}>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={l.label}
          className="grid size-10 place-items-center rounded-full border border-white/15 text-paper/80 transition-colors hover:border-brand hover:bg-brand hover:text-white"
        >
          {l.icon}
        </a>
      ))}
    </div>
  )
}
