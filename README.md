# Eurowerks Automotive — website redesign

A redesign concept for [eurowerksauto.com](https://www.eurowerksauto.com/): European service & performance, Pompano Beach, FL.

## The hero: "Built part by part"

The homepage opens on a blueprint of a supercar. As you scroll, the car assembles itself one part at a time, and each part is tied to a Eurowerks service:

| Scroll | Part | Service called out |
| --- | --- | --- |
| 0–12% | Blueprint wireframe draws in | — |
| 12% | Carbon monocoque + roll structure | Pre-purchase inspection |
| 18% | Coil-over suspension | Suspension upgrades |
| 22% | Twin-turbo V8 drops in | ECU tuning |
| 30% | Wheels roll in (rotation matches travel) | Precision alignment |
| 36% | Brake calipers | Brake systems |
| 42–58% | Front, door and rear body panels fly in | Factory-matched maintenance |
| 54–67% | Glass, splitter, skirts, diffuser, wing, exhaust | Exhaust systems |
| 64% | Headlights, mirrors | ADAS calibration |
| 70–80% | Primer → gloss red paint wipe with specular sweep | The car spa |
| 80–84% | Ignition: lights flicker on, red underglow | — |
| 84%+ | "Every part. Every system. Mastered." + CTAs | — |

The car is a hand-built SVG (`src/components/hero/carGeometry.ts`), so it stays sharp at any size, weighs a few KB and needs no 3D runtime. All motion is scroll-linked with Framer Motion (`useScroll` + `useTransform` + `useSpring`) in `src/components/hero/CarAssembly.tsx`. The timeline lives in one table (`T`) there, so retiming is a one-line change.

## Rest of the page

- Preloader with the Eurowerks wordmark and a counter
- Floating glass navbar that hides when you scroll down, plus a full-screen mobile menu
- Marques marquee
- A manifesto whose words light up as you scroll (copy from the current About Us)
- Services bento grid with spotlight hover and animated borders
- **The Car Spa**: a sticky, scroll-driven walkthrough of the client experience
- "Recently on our lifts": a horizontal-scroll gallery of real shop photos, with velocity skew
- Marques list with hover reveal
- Service areas and a dark-styled map
- Contact section and a footer with a giant outline wordmark

Smooth scrolling uses Lenis. With `prefers-reduced-motion` turned on, the site shows the finished car and skips the heavy motion.

## Content and assets

All business info (phones, address, hours, email, services, cities) and every photo comes from the current site. The photos were resized to WebP and live in `public/images/`.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Deploys as a static site to Vercel, Netlify or Cloudflare Pages with no configuration.

Stack: Vite · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · lucide-react.
