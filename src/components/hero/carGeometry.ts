// Side-profile mid-engine supercar, drawn on a 1200 x 460 canvas (car faces left).
// Every part is a separate path so the hero can fly them in one by one.

export const VIEW_W = 1200
export const VIEW_H = 460
export const GROUND_Y = 392

export const FRONT_WHEEL = { cx: 292, cy: 328 }
export const REAR_WHEEL = { cx: 912, cy: 328 }
export const TIRE_R = 64
export const RIM_R = 47

// Full body silhouette, including both wheel-arch cut-outs.
export const BODY =
  
  'M 112 338 C 104 330 104 318 116 312 C 150 300 200 280 250 262 C 290 248 330 244 370 244 ' +
  'C 420 244 455 240 480 234 C 540 196 590 156 650 142 C 700 134 750 136 790 146 ' +
  'C 870 166 960 190 1050 204 C 1074 208 1092 210 1098 216 C 1104 220 1104 228 1100 236 ' +
  'L 1094 312 C 1092 330 1084 340 1066 341 L 989 341 A 78 78 0 1 0 835 341 L 369 341 ' +
  'A 78 78 0 1 0 215 341 L 150 341 C 130 341 116 341 112 338 Z'

// Panel split lines (x positions) used to clip the body into separate panels.
export const PANEL_SPLITS = { front: 512, rear: 800 }

export const SIDE_WINDOW =
  
  'M 522 228 C 570 196 612 168 662 156 C 710 148 752 150 792 160 C 800 172 800 192 790 216 C 720 226 600 232 522 228 Z'

export const WINDSHIELD_EDGE = 'M 480 234 C 540 196 590 156 650 142'

export const DOOR_SEAM =
  
  'M 512 236 C 520 270 532 310 548 338 L 772 338 C 784 300 796 262 804 222'

export const CHARACTER_LINE = 'M 380 302 C 500 298 640 294 784 286'

export const SIDE_INTAKE =
  
  'M 792 254 C 832 246 872 252 902 268 L 882 306 C 850 302 818 296 786 292 Z'

export const INTAKE_FINS = [
  'M 802 264 L 888 272',
  'M 800 276 L 884 286',
  'M 796 288 L 878 298',
]

export const HEADLIGHT =
  
  'M 146 302 C 188 286 228 270 270 258 L 266 270 C 226 280 188 294 154 310 Z'

export const HEADLIGHT_DRL = 'M 158 300 C 196 286 232 274 264 264'

export const FRONT_INTAKE = 'M 124 328 C 150 322 180 316 206 312 L 212 330 C 184 334 150 336 128 338 Z'

export const TAILLIGHT = 'M 1080 208 C 1092 210 1100 214 1101 222 L 1100 244 L 1084 240 Z'

export const FRONT_SPLITTER = 'M 100 338 L 262 338 L 258 350 L 118 350 Z'

export const SIDE_SKIRT = 'M 369 338 L 835 338 L 828 352 L 378 352 Z'

export const DIFFUSER = 'M 989 338 L 1092 338 L 1106 362 L 1002 357 Z'

export const DIFFUSER_FINS = ['M 1016 340 L 1020 357', 'M 1042 340 L 1048 359', 'M 1068 340 L 1076 360']

export const WING = 'M 950 138 L 1118 144 C 1128 146 1128 158 1118 160 L 956 156 C 944 154 942 140 950 138 Z'

export const WING_ENDPLATE = 'M 1104 124 L 1128 126 L 1126 172 L 1102 168 Z'

export const WING_STRUTS = ['M 1000 154 C 1002 170 1000 182 994 196', 'M 1062 158 C 1064 174 1064 190 1060 204']

export const MIRROR =
  
  'M 536 220 C 520 214 512 202 526 196 L 562 198 C 574 200 574 214 564 218 Z'

export const MIRROR_STALK = 'M 552 216 L 566 232'

export const EXHAUST_TIPS = [
  { cx: 1080, cy: 326, rx: 10, ry: 7 },
  { cx: 1056, cy: 328, rx: 10, ry: 7 },
]

// --- Mechanical parts (visible during assembly, later hidden under the body) ---

export const MONOCOQUE =
  'M 210 318 C 260 300 420 292 560 290 L 860 290 C 940 292 1010 300 1060 314 L 1064 340 L 206 340 Z'

export const ROLL_CAGE = [
  'M 520 290 C 560 230 610 168 662 152 C 710 142 752 142 794 154 L 830 290',
  'M 610 290 L 660 160',
  'M 760 290 L 780 150',
]

export const ENGINE_BLOCK = 'M 842 206 L 1036 222 L 1050 300 L 850 300 Z'

export const ENGINE_DETAILS = [
  'M 870 222 L 1020 232',
  'M 870 238 L 1028 248',
  'M 866 256 L 1036 266',
  'M 866 274 L 1040 284',
]

export const ENGINE_INTAKE_RUNNERS = [
  'M 880 214 C 884 196 902 190 910 214',
  'M 920 216 C 924 198 942 192 950 218',
  'M 960 219 C 964 201 982 195 990 221',
  'M 1000 222 C 1004 204 1022 198 1030 224',
]

export const SEAT = 'M 706 286 L 698 210 C 698 196 714 190 726 194 L 742 202 L 754 286 Z'

export const STEERING_WHEEL = { cx: 612, cy: 230, r: 18 }

// Coil-over suspension sitting above each wheel hub.
export function coilover(cx: number, cy: number) {
  const top = cy - 92
  const turns = 6
  const h = (cy - 18 - top) / turns
  let spring = `M ${cx} ${top}`
  for (let i = 0; i < turns; i++) {
    const y = top + i * h
    spring += ` L ${cx + 14} ${y + h * 0.5} L ${cx - 14} ${y + h}`
  }
  return {
    spring,
    damper: `M ${cx - 5} ${top - 6} L ${cx + 5} ${top - 6} L ${cx + 5} ${cy - 12} L ${cx - 5} ${cy - 12} Z`,
    arm: `M ${cx - 70} ${cy + 6} L ${cx} ${cy} L ${cx + 70} ${cy + 6}`,
  }
}

// Blueprint dimension guides drawn before anything else arrives.
export const DIMENSIONS = [
  { d: 'M 104 418 L 1104 418', label: 'OVERALL LENGTH  4 620', x: 604, y: 438 },
  { d: 'M 292 404 L 912 404', label: 'WHEELBASE  2 700', x: 602, y: 398 },
  { d: 'M 1156 136 L 1156 392', label: 'H  1 165', x: 1180, y: 268 },
]

export const SHOULDER_HIGHLIGHT = 'M 560 262 C 680 250 800 232 900 216 C 960 208 1020 210 1080 214'

export const FASTBACK_LOUVRES = Array.from({ length: 6 }, (_, i) => {
  const x = 862 + i * 26
  const y = 172 + i * 5.6
  return `M ${x} ${y} L ${x + 18} ${y + 5}`
})
