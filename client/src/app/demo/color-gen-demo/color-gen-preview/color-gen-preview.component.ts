import { DOCUMENT } from '@angular/common';
import { booleanAttribute, Component, computed, inject, input, output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { materialPalettePercentagesMap } from '../color-gen-demo.constants';
import { ColorGenFormValue } from '../color-gen-form/color-gen-form.types';
import { percentageToRgbFactory } from './color-gen-preview.utils';

@Component({
  selector: 'app-color-gen-preview',
  host: { class: 'app-color-gen-preview' },
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './color-gen-preview.component.html',
  styleUrl: './color-gen-preview.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorGenPreviewComponent {
  private clipboard = inject(DOCUMENT).defaultView?.navigator.clipboard;

  mirrorView = input(false, { transform: booleanAttribute });

  formValue = input.required<ColorGenFormValue | undefined>();

  action = output<void>();

  protected colorMap = computed(() => {
    const formValue = this.formValue();
    if (!formValue) {
      return [];
    }

    const { color, start, end, /*easing, */ reverse, neutral, cubicBezier } = formValue;

    const percentagesMap = materialPalettePercentagesMap[neutral ? 'neutral' : 'default'];
    const percentageToRgb = percentageToRgbFactory({ color /*, easing*/, reverse, cubicBezier });

    return percentagesMap
      .map((percentage) => ({
        percentage,
        adjustedPercentage: start + (percentage / 100) * (end - start),
      }))
      .map(({ percentage, adjustedPercentage }) => ({ percentage, color: percentageToRgb(adjustedPercentage) }));
  });

  protected sassMapToClipboard() {
    const formValue = this.formValue();
    if (!formValue) {
      return;
    }
    const settings = `  // ${this.stringifyColorGen(formValue)}`;
    this.clipboard?.writeText(`${settings}\n${this.sassMap()}`);
  }

  private stringifyColorGen(formValue: ColorGenFormValue) {
    const value = { ...formValue };
    value.color = value.color.toLowerCase();
    return JSON.stringify(value);
  }

  protected sassMap = computed(() => {
    const map = this.colorMap()
      .map(({ percentage, color }) => `  ${percentage}: ${color}`)
      .join(',\n');

    return map;
  });
}
