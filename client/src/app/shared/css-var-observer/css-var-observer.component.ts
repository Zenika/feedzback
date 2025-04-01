import {
  afterRenderEffect,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ThemeService } from '../theme';

@Component({
  exportAs: 'appCssVarObserver',
  selector: 'app-css-var-observer',
  host: {
    class: '.app-css-var-observer',
    '[style.color]': '"var(" + cssVarName() + ")"',
  },
  template: '',
  styles: '.app-css-var-observer { position: absolute; left: -99999px }',
  encapsulation: ViewEncapsulation.None,
})
export class CssColorObserverComponent {
  private host: HTMLElement = inject(ElementRef).nativeElement;

  private theme = inject(ThemeService).theme;

  cssVarName = input.required<string>();

  private _rgbColor = signal<string | undefined>(undefined);

  rgbColor = this._rgbColor.asReadonly();

  rgbColorChange = output<string | undefined>();

  constructor() {
    afterRenderEffect(() => {
      this.theme();
      this.cssVarName();

      const rgbColor = this.host.computedStyleMap().get('color')?.toString();
      this._rgbColor.set(rgbColor);
      this.rgbColorChange.emit(rgbColor);
    });
  }
}
