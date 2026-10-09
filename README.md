# Eurowerks Automotive — website redesign

A redesign concept for [eurowerksauto.com](https://www.eurowerksauto.com/): European service & performance, Pompano Beach, FL.

## The hero: "Built part by part"

The homepage opens on a film of a hypercar assembling itself from flying parts. The film is scrubbed by scroll: it moves forward and backward exactly as fast as you scroll. Its 97 frames (`public/hero/`) are drawn to a full-screen canvas, which is smoother than seeking a `<video>` element.

As the car comes together, the stage rail highlights the Eurowerks service behind each step:

| Frames | Stage | Service |
| --- | --- | --- |
| 1–16 | Cockpit & electronics | Diagnostics & electrical |
| 17–32 | Steering & front structure | Precision alignment |
| 33–48 | Chassis, wheels & brakes | Brake systems |
| 49–64 | Suspension & drivetrain | Suspension · ECU tuning |
| 65–80 | Body panels | Factory-matched service |
| 81–89 | Paint & finish | The car spa |
| 90–97 | Lights & sensors | ADAS calibration |

When the film ends, "Every part. Every system. Mastered." appears with the booking buttons. The stages and timing are set at the top of `src/components/hero/CarAssembly.tsx`.

**Swapping the film:** export frames from a new video with
`ffmpeg -i film.mp4 -vf "scale=1296:-2:flags=lanczos" -c:v libwebp -quality 72 public/hero/f%03d.webp`,
then update `FRAME_COUNT` and the `STAGES` frame numbers.

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

## Deploy

The live site is served from the `gh-pages` branch at https://amanzor.github.io/eurowerks/. To redeploy, run the **Deploy to GitHub Pages** workflow from the Actions tab.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Deploys as a static site to Vercel, Netlify or Cloudflare Pages with no configuration.

Stack: Vite · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · lucide-react.
