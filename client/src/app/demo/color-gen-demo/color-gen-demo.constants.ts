import CubicBezier from '@mapbox/unitbezier';

const cubicBezier = new CubicBezier(0.29, 0.03, 0.04, 1);

// https://easings.net/
export const easingFuncs = [
  {
    name: 'linear',
    func: (x: number) => x,
  },

  {
    name: 'cubicBezier',
    func: (x: number) => cubicBezier.solve(x),
  },

  // ----- easeIn -----
  {
    name: 'easeInSine',
    func: (x: number) => 1 - Math.cos((x * Math.PI) / 2),
  },
  {
    name: 'easeInQuad',
    func: (x: number) => x * x,
  },
  {
    name: 'easeInCubic',
    func: (x: number) => x * x * x,
  },
  {
    name: 'easeInCirc',
    func: (x: number) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  },
  {
    name: 'easeInQuart',
    func: (x: number) => x * x * x * x,
  },
  {
    name: 'easeInQuint',
    func: (x: number) => x * x * x * x * x,
  },

  // ----- easeInOut -----
  {
    name: 'easeInOutSine',
    func: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  },
  {
    name: 'easeInOutQuad',
    func: (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  },
  {
    name: 'easeInOutCubic',
    func: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  },
  {
    name: 'easeInOutCirc',
    func: (x: number) =>
      x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
  },
  {
    name: 'easeInOutQuart',
    func: (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
  },
  {
    name: 'easeInOutQuint',
    func: (x: number) => (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2),
  },

  // ----- easeOut -----
  {
    name: 'easeOutQuint',
    func: (x: number) => 1 - Math.pow(1 - x, 5),
  },
  {
    name: 'easeOutQuart',
    func: (x: number) => 1 - Math.pow(1 - x, 4),
  },
  {
    name: 'easeOutCirc',
    func: (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2)),
  },
  {
    name: 'easeOutCubic',
    func: (x: number) => 1 - Math.pow(1 - x, 3),
  },
  {
    name: 'easeOutQuad',
    func: (x: number) => 1 - (1 - x) * (1 - x),
  },
  {
    name: 'easeOutSine',
    func: (x: number) => Math.sin((x * Math.PI) / 2),
  },
];
export const easingFuncNames = easingFuncs.map(({ name }) => name);

export const materialPalettePercentagesMap = {
  // Works for Material `primary`, `secondary`, `tertiary`, `neutral-variant` and `error` palettes
  default: [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100],

  // Works for Material `neutral` palette
  neutral: [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100],
};
