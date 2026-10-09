// All business details below are taken from the current eurowerksauto.com site.
export const business = {
  name: 'Eurowerks Automotive',
  address: '4758 N Powerline Rd',
  city: 'Pompano Beach, FL 33073',
  mapsQuery: '4758 N Powerline Rd, Pompano Beach, FL 33073',
  email: 'Office@Eurowerksauto.com',
  hours: [
    { days: 'Mon – Fri', time: '8am – 6pm' },
    { days: 'Sat – Sun', time: 'Closed' },
  ],
  advisors: [
    { name: 'Aavin', phone: '954-478-1888' },
    { name: 'Jared', phone: '954-675-0173' },
  ],
  socials: {
    instagram: 'https://www.instagram.com/eurowerks/',
    facebook: 'https://www.facebook.com/EurowerksAuto',
  },
}

export const marques = [
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Porsche',
  'Land Rover',
  'Rolls-Royce',
  'Bentley',
]

export const serviceAreas = [
  'Coconut Creek',
  'Pompano Beach',
  'Coral Springs',
  'Boca Raton',
  'Fort Lauderdale',
  'Margate',
  'Parkland',
  'Deerfield Beach',
  'Sunrise',
  'Plantation',
  'Lighthouse Point',
  'Hillsboro Beach',
  'Oakland Park',
  'Delray Beach',
]

export type Service = {
  title: string
  kicker: string
  body: string
  image?: string
  span?: string
}

export const services: Service[] = [
  {
    kicker: '01 — Maintenance',
    title: 'Factory-Matched Service',
    body: 'BMW, Audi, Mercedes-Benz and Porsche maintenance performed to manufacturer procedure, with quality parts and dealer-level diagnostics.',
    image: 'images/bmw-m4-green-bay.webp',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    kicker: '02 — Performance',
    title: 'ECU Tuning',
    body: 'Calibrated software for more response, more power and a car that still behaves every day.',
    image: 'images/bmw-m-bay.webp',
  },
  {
    kicker: '03 — Stopping Power',
    title: 'Brake Systems',
    body: 'Pads, rotors, big-brake upgrades and full fluid flushes.',
    image: 'images/audi-r8-gt-front.webp',
  },
  {
    kicker: '04 — Chassis',
    title: 'Suspension & Precision Alignment',
    body: 'Coilovers, lowering and laser-precise alignment so the car tracks exactly the way it was engineered to.',
    image: 'images/huracan-green-lift.webp',
    span: 'md:col-span-2',
  },
  {
    kicker: '05 — Sound',
    title: 'Exhaust',
    body: 'Valved and race exhaust systems, installed and tuned.',
    image: 'images/porsche-gt2rs-exhaust.webp',
  },
  {
    kicker: '06 — Safety Tech',
    title: 'ADAS Calibration',
    body: 'Cameras, radar and driver-assist sensors re-aimed to spec after glass, alignment or collision work.',
    image: 'images/bmw-m5-green-front.webp',
  },
  {
    kicker: '07 — Peace of Mind',
    title: 'Pre-Purchase & Warranty',
    body: 'Thorough pre-purchase inspections and 3rd-party warranty repairs handled start to finish.',
    image: 'images/audi-r8-blue.webp',
  },
  {
    kicker: '08 — Everything Else',
    title: 'Engine, Electrical & A/C',
    body: 'Engine repair, battery and electrical faults, A/C and general diagnostics.',
    image: 'images/huracan-engine-out.webp',
  },
]

// Highlights for the homepage strip; the full set lives on the gallery page (src/data/gallery.ts).
export const gallery = [
  { src: 'images/huracan-engine-out.webp', caption: 'Huracán · engine out' },
  { src: 'images/huracan-sto.webp', caption: 'Lamborghini Huracán STO' },
  { src: 'images/porsche-gt2rs-engine.webp', caption: 'Porsche 911 GT2 RS' },
  { src: 'images/bmw-m4-green-bronze.webp', caption: 'BMW M4 Competition' },
  { src: 'images/maybach-two-tone.webp', caption: 'Mercedes-Maybach S-Class' },
  { src: 'images/audi-r8-blue.webp', caption: 'Audi R8 V10' },
  { src: 'images/porsche-911-classic.webp', caption: 'Classic Porsche 911' },
  { src: 'images/rolls-cullinan.webp', caption: 'Rolls-Royce Cullinan' },
  { src: 'images/bmw-m3-e92-white.webp', caption: 'BMW M3 (E92)' },
  { src: 'images/ferrari-328.webp', caption: 'Ferrari 328' },
]
