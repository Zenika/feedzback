import colorConvert from 'color-convert';
import { ColorGenFormValue } from './color-gen-form/color-gen-form.types';

// https://easings.net/
export const easingFuncs = [
  {
    name: 'linear',
    func: (x: number) => x,
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

export const percentageToRgbFactory = ({
  rgb,
  easing,
  reverse,
}: Pick<ColorGenFormValue, 'rgb' | 'easing' | 'reverse'>) => {
  const [h, l] = colorConvert.hex.hsl(rgb);

  const { func } = easingFuncs.find(({ name }) => name === easing) ?? easingFuncs[0];

  const s = reverse
    ? (percent: number) => 100 - func(percent / 100) * 100
    : (percent: number) => func(percent / 100) * 100;

  return (percent: number) => '#' + colorConvert.hsl.hex(h, l, s(percent)).toLowerCase();
};

export const getRange = (start: number | null, end: number | null): { start: number; end: number } => ({
  start: start ?? 0,
  end: end ?? 100,
});

export const consolidateColorGenFormValue = (formValue: ColorGenFormValue) => {
  const value = { ...formValue };
  value.rgb = value.rgb.toLowerCase();
  value.start ??= 0;
  value.end ??= 100;

  return value as ColorGenFormValue & { start: number; end: number };
};
