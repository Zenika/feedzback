import { ColorGenBezier } from '../color-gen-bezier/color-gen-bezier.types';

export type ColorGenFormValue = {
  color: string;
  start: number;
  end: number;
  easing: string;
  reverse: boolean;
  neutral: boolean;

  cubicBezier: ColorGenBezier;
};
