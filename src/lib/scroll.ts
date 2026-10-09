import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/** Freeze or release page scrolling, e.g. while a fullscreen overlay is open. */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
