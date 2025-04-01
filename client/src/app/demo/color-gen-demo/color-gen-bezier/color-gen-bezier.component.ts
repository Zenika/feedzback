import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  untracked,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import CubicBezier from '@mapbox/unitbezier';
import { ColorGenBezier } from './color-gen-bezier.types';

@Component({
  selector: 'app-color-gen-bezier',
  host: {
    class: 'app-color-gen-bezier',
    '[style.--app-color-gen-bezier-canvas-size]': 'canvasSize() + "px"',
    '[style.--app-color-gen-bezier-point-size]': 'pointSize() + "px"',
  },
  imports: [CdkDrag, MatRippleModule],
  templateUrl: './color-gen-bezier.component.html',
  styleUrl: './color-gen-bezier.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorGenBezierComponent implements ControlValueAccessor {
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

  lineColor = input<string>();

  skipNextParamsEffect = false;

  disabled = model(false);

  private cdkDrags = viewChildren(CdkDrag);

  constructor() {
    afterRenderEffect(() => this.updateCanvas());

    afterRenderEffect(() => {
      const params = this.params();
      if (this.skipNextParamsEffect) {
        this.skipNextParamsEffect = false;
        return;
      }
      untracked(() => this.positioningPoints(params));
    });

    const ngControl = inject(NgControl, { optional: true, self: true });
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  private positioningPoints(params: ColorGenBezier) {
    const baseSize = this.canvasSize() - this.pointSize();

    const [p1Drag, p2Drag] = this.cdkDrags();

    p1Drag.setFreeDragPosition({
      x: params.p1x * baseSize,
      y: baseSize - params.p1y * baseSize,
    });
    p2Drag.setFreeDragPosition({
      x: params.p2x * baseSize,
      y: baseSize - params.p2y * baseSize,
    });
  }

  protected updateParam(p: 'p1' | 'p2') {
    const container = this.containerElement.getBoundingClientRect();
    const point = this[p]().nativeElement.getBoundingClientRect();
    const baseSize = this.canvasSize() - this.pointSize();

    this.skipNextParamsEffect = true;
    this.params.update((params) => {
      const x = Math.round((1000 * (point.x - container.x)) / baseSize) / 1000;
      const y = Math.round(1000 - (1000 * (point.y - container.y)) / baseSize) / 1000;

      const newParams = { ...params };
      if (p === 'p1') {
        newParams.p1x = x;
        newParams.p1y = y;
      } else {
        newParams.p2x = x;
        newParams.p2y = y;
      }
      return newParams;
    });
    this.onChange(this.params());
    this.onTouched();
  }

  private updateCanvas() {
    const ctx = this.canvasContext();
    const canvasSize = this.canvasSize();
    const cubicBezier = this.cubicBezier();
    const lineColor = this.lineColor();

    if (!ctx) {
      console.warn('ColorGenBezierComponent: canvas is not supported');
      return;
    }

    ctx.strokeStyle = lineColor ?? 'red';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.beginPath();
    ctx.moveTo(0, canvasSize);
    for (let step = 0; step <= canvasSize; step += 1) {
      ctx.lineTo(step, (1 - cubicBezier.solve(step / canvasSize)) * canvasSize);
    }
    ctx.stroke();
  }

  // ----- ControlValueAccessor -----

  private onChange: (params: ColorGenBezier) => void = () => undefined;

  private onTouched: () => void = () => undefined;

  registerOnChange(onChange: (params: ColorGenBezier) => undefined): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  writeValue(params: ColorGenBezier | null | undefined): void {
    this.params.set(params ?? { p1x: 0, p1y: 0, p2x: 1, p2y: 1 });
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
