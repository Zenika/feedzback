import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import CubicBezier from '@mapbox/unitbezier';
import { ColorGenBezier } from './color-gen-bezier.types';

@Component({
  selector: 'app-color-gen-bezier',
  host: {
    class: 'app-color-gen-bezier',
    '[style.--app-color-gen-bezier-canvas-size]': 'canvasSize() + "px"',
    '[style.--app-color-gen-bezier-point-size]': 'pointSize() + "px"',
  },
  imports: [CdkDrag],
  templateUrl: './color-gen-bezier.component.html',
  styleUrl: './color-gen-bezier.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorGenBezierComponent {
  private containerElement: HTMLElement = inject(ElementRef).nativeElement;

  params = model<ColorGenBezier>({ p1x: 0, p1y: 0, p2x: 1, p2y: 1 });

  private cubicBezier = computed(() => {
    const { p1x, p1y, p2x, p2y } = this.params();
    return new CubicBezier(p1x, p1y, p2x, p2y);
  });

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private canvasContext = computed(() => this.canvasRef().nativeElement.getContext('2d'));

  canvasSize = input(200);

  private p1 = viewChild.required<ElementRef<HTMLElement>>('p1');

  private p2 = viewChild.required<ElementRef<HTMLElement>>('p2');

  pointSize = input(24);

  skipNextParamsEffect = false;

  constructor() {
    afterNextRender(() => this.renderCanvas());

    effect(() => {
      const params = this.params();
      if (this.skipNextParamsEffect) {
        this.skipNextParamsEffect = false;
        return;
      }
      untracked(() => this.positioningPoints(params));
    });
  }

  private positioningPoints(params: ColorGenBezier) {
    const size = this.canvasSize() - this.pointSize();

    const p1 = this.p1().nativeElement;
    p1.style.left = params.p1x * size + 'px';
    p1.style.bottom = params.p1y * size + 'px';

    const p2 = this.p2().nativeElement;
    p2.style.left = params.p2x * size + 'px';
    p2.style.bottom = params.p2y * size + 'px';
  }

  protected updateParam(p: 'p1' | 'p2') {
    const container = this.containerElement.getBoundingClientRect();
    const point = this[p]().nativeElement.getBoundingClientRect();
    const size = this.canvasSize() - this.pointSize();

    this.skipNextParamsEffect = true;
    this.params.update((params) => {
      const x = Math.round((1000 * (point.x - container.x)) / size) / 1000;
      const y = Math.round(1000 - (1000 * (point.y - container.y)) / size) / 1000;

      if (p === 'p1') {
        return { ...params, p1x: x, p1y: y };
      } else {
        return { ...params, p2x: x, p2y: y };
      }
    });

    this.renderCanvas();
  }

  private renderCanvas() {
    const ctx = this.canvasContext();
    if (!ctx) {
      console.warn('ColorGenBezierComponent: canvas is not supported');
      return;
    }

    const size = this.canvasSize();

    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = '#ee2236';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, size);
    for (let i = 0; i <= 1000; i += 10) {
      ctx.lineTo((i * size) / 1000, (1 - this.cubicBezier().solve(i / 1000)) * size);
    }
    ctx.stroke();
  }
}
