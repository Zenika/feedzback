import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ColorGenFormComponent } from './color-gen-form/color-gen-form.component';
import { ColorGenFormValue } from './color-gen-form/color-gen-form.types';
import { ColorGenGuideComponent } from './color-gen-guide/color-gen-guide.component';
import { ColorGenPreviewComponent } from './color-gen-preview/color-gen-preview.component';

@Component({
  selector: 'app-color-gen-demo',
  imports: [ColorGenFormComponent, ColorGenGuideComponent, ColorGenPreviewComponent],
  templateUrl: './color-gen-demo.component.html',
  styleUrl: './color-gen-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorGenDemoComponent {
  protected formValue = signal<ColorGenFormValue | undefined>(undefined);

  protected formValueMirror = signal<ColorGenFormValue | undefined>(undefined);
}
