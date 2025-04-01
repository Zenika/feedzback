import { Point } from '@angular/cdk/drag-drop';

export type ColorGenBezier = {
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
};

export type ColorGenBezierDragPoints = {
  p1: Point;
  p2: Point;
};
