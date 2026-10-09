// Every photo from the current eurowerksauto.com homepage and gallery.
// `ratio` is height / width, so the grid can reserve space before images load.

export type Make = 'BMW' | 'Audi' | 'Porsche' | 'Lamborghini' | 'Mercedes-Benz' | 'Rolls-Royce' | 'Ferrari'

export type Photo = {
  file: string
  caption: string
  make?: Make
  /** Shot of a car being worked on in the shop. */
  work?: boolean
  ratio: number
}

const P = 4 / 3 // portrait 3:4 shot
const L = 3 / 4 // landscape 4:3 shot

export const photos: Photo[] = [
  { file: 'huracan-engine-out', caption: 'Lamborghini Huracán · engine out', make: 'Lamborghini', work: true, ratio: 0.554 },
  { file: 'bmw-m4-green-bronze', caption: 'BMW M4 Competition', make: 'BMW', ratio: P },
  { file: 'porsche-gt2rs-engine', caption: 'Porsche 911 GT2 RS · engine bay', make: 'Porsche', work: true, ratio: L },
  { file: 'audi-r8-blue', caption: 'Audi R8 V10', make: 'Audi', ratio: L },
  { file: 'maybach-two-tone', caption: 'Mercedes-Maybach S-Class', make: 'Mercedes-Benz', work: true, ratio: 1.778 },
  { file: 'huracan-sto', caption: 'Lamborghini Huracán STO', make: 'Lamborghini', ratio: P },
  { file: 'bmw-m3-e92-white', caption: 'BMW M3 (E92)', make: 'BMW', ratio: P },
  { file: 'rolls-cullinan', caption: 'Rolls-Royce Cullinan', make: 'Rolls-Royce', ratio: P },
  { file: 'porsche-gt2rs-parts', caption: 'Porsche 911 GT2 RS · intercoolers & exhaust', make: 'Porsche', work: true, ratio: P },
  { file: 'audi-r8-chameleon', caption: 'Audi R8 Spyder', make: 'Audi', ratio: P },
  { file: 'ferrari-328', caption: 'Ferrari 328', make: 'Ferrari', ratio: L },
  { file: 'bmw-m4-frozen', caption: 'BMW M4 · frozen finish', make: 'BMW', work: true, ratio: 1.778 },
  { file: 'huracan-black', caption: 'Lamborghini Huracán', make: 'Lamborghini', ratio: P },
  { file: 'bmw-m5-green-front', caption: 'BMW M5', make: 'BMW', ratio: L },
  { file: 'audi-r8-engine-glass', caption: 'Audi R8 · V10 under glass', make: 'Audi', ratio: P },
  { file: 'porsche-911-classic', caption: 'Classic Porsche 911', make: 'Porsche', ratio: P },
  { file: 'huracan-green-lift', caption: 'Lamborghini Huracán · on the lift', make: 'Lamborghini', work: true, ratio: P },
  { file: 'bmw-m4-widebody', caption: 'BMW M4 widebody', make: 'BMW', ratio: 0.5625 },
  { file: 'sl-r8-duo', caption: 'Mercedes-AMG SL & Audi R8', make: 'Mercedes-Benz', ratio: L },
  { file: 'bmw-m-bay', caption: 'BMW M · in the bay', make: 'BMW', work: true, ratio: P },
  { file: 'audi-r8-gt-front', caption: 'Audi R8 · in the bay', make: 'Audi', work: true, ratio: P },
  { file: 'aventador-lineup', caption: 'Lamborghini Aventador & company', make: 'Lamborghini', ratio: L },
  { file: 'bmw-m2', caption: 'BMW M2', make: 'BMW', ratio: P },
  { file: 'audi-etron-gt-rear', caption: 'Audi RS e-tron GT', make: 'Audi', work: true, ratio: P },
  { file: 'bmw-blue-bay', caption: 'BMW · in the bay', make: 'BMW', work: true, ratio: 1.778 },
  { file: 'huracan-lift-top', caption: 'Lamborghini Huracán · from above', make: 'Lamborghini', work: true, ratio: P },
  { file: 'bmw-m5-green-shop', caption: 'BMW M5 at the shop', make: 'BMW', ratio: L },
  { file: 'audi-r8-red', caption: 'Audi R8 V10', make: 'Audi', ratio: P },
  { file: 'porsche-gt2rs-exhaust', caption: 'Porsche 911 GT2 RS · exhaust build', make: 'Porsche', work: true, ratio: P },
  { file: 'bmw-3-series', caption: 'BMW 3 Series', make: 'BMW', ratio: P },
  { file: 'bmw-m4-csl-front', caption: 'BMW M4 widebody · front', make: 'BMW', ratio: 0.5625 },
  { file: 'audi-rs-matte', caption: 'Audi R8 · matte', make: 'Audi', ratio: P },
  { file: 'shop-exterior-r8', caption: 'Eurowerks HQ', make: 'Audi', ratio: L },
  { file: 'bmw-m4-green-bay', caption: 'BMW M4 · in the bay', make: 'BMW', work: true, ratio: P },
  { file: 'audi-r8-shop', caption: 'Audi R8', make: 'Audi', ratio: L },
  { file: 'bmw-m5-green-detail', caption: 'BMW M5 · detail', make: 'BMW', ratio: 0.807 },
  { file: 'shop-street', caption: '4758 N Powerline Rd', ratio: L },
]

export const fullSrc = (p: Photo) => `images/${p.file}.webp`
export const thumbSrc = (p: Photo) => `images/thumbs/${p.file}.webp`
