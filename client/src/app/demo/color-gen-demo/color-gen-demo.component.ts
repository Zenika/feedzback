import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { materialPaletteMapPercentages } from './color-gen-demo.constants';
import { easingFuncNames, percentageToRgbFactory } from './color-gen-demo.utils';
import { ColorGenFormComponent } from './color-gen-form/color-gen-form.component';
import { ColorGenFormValue } from './color-gen-form/color-gen-form.types';
import { ColorGenGuideComponent } from './color-gen-guide/color-gen-guide.component';

@Component({
  selector: 'app-color-gen-demo',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ColorGenFormComponent,
    ColorGenGuideComponent,
  ],
  templateUrl: './color-gen-demo.component.html',
  styleUrl: './color-gen-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorGenDemoComponent {
  private document = inject(DOCUMENT);

  protected easingFuncNames = easingFuncNames;

  protected formValue = signal<ColorGenFormValue | undefined>(undefined);

  protected colorMap = computed(() => {
    const formValue = this.formValue();
    if (!formValue) {
      return [];
    }

    const { color, start, end, easing, reverse, neutral } = formValue;

    const mapPercentages = materialPaletteMapPercentages[neutral ? 'neutral' : 'default'];
    const percentageToRgb = percentageToRgbFactory({ color, easing, reverse });

    return mapPercentages
      .map((percentage) => ({
        percentage,
        adjustedPercentage: start + (percentage / 100) * (end - start),
      }))
      .map(({ percentage, adjustedPercentage }) => ({ percentage, color: percentageToRgb(adjustedPercentage) }));
  });

  protected sassMap = computed(() => {
    const map = this.colorMap()
      .map(({ percentage, color }) => `  ${percentage}: ${color}`)
      .join(',\n');

    return map;
  });

  protected sassMapToClipboard() {
    const formValue = this.formValue();
    if (!formValue) {
      return;
    }
    const settings = `  // ${this.stringifyColorGen(formValue)}`;
    this.document.defaultView?.navigator.clipboard.writeText(`${settings}\n${this.sassMap()}`);
  }

  private stringifyColorGen(formValue: ColorGenFormValue) {
    const value = { ...formValue };
    value.color = value.color.toLowerCase();
    return JSON.stringify(value);
  }
}
