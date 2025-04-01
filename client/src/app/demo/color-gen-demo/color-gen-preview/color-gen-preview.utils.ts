import CubicBezier from '@mapbox/unitbezier';
import colorConvert from 'color-convert';
//import { easingFuncs } from '../color-gen-demo.constants';
import { ColorGenFormValue } from '../color-gen-form/color-gen-form.types';

export const percentageToRgbFactory = ({
  color,
  //easing,
  reverse,
  cubicBezier,
}: Pick<ColorGenFormValue, 'color' /*| 'easing'*/ | 'reverse' | 'cubicBezier'>) => {
  const [h, l] = colorConvert.hex.hsl(color);

  //const { func } = easingFuncs.find(({ name }) => name === easing) ?? easingFuncs[0];

  const { p1x, p1y, p2x, p2y } = cubicBezier;
  const cb = new CubicBezier(p1x, p1y, p2x, p2y);
  const func = (x: number) => cb.solve(x);

  const s = reverse
    ? (percent: number) => 100 - func(percent / 100) * 100
    : (percent: number) => func(percent / 100) * 100;

  return (percent: number) => '#' + colorConvert.hsl.hex(h, l, s(percent)).toLowerCase();
};
