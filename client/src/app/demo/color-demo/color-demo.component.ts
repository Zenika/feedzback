import { DOCUMENT } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElementToBgColorPipe } from './element-to-bg-color.pipe';

@Component({
  selector: 'app-color-demo',
  imports: [MatSlideToggleModule, MatTooltipModule, ElementToBgColorPipe],
  templateUrl: './color-demo.component.html',
  styleUrl: './color-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorDemoComponent {
  #document = inject(DOCUMENT);

  protected displayHexColor = true;

  // Learn more about Material color roles: https://m3.material.io/styles/color/roles
  protected materialColorRoles = [
    'background',
    'error',
    'error-container',
    'inverse-on-surface',
    'inverse-primary',
    'inverse-surface',
    'on-background',
    'on-error',
    'on-error-container',
    'on-primary',
    'on-primary-container',
    'on-primary-fixed',
    'on-primary-fixed-variant',
    'on-secondary',
    'on-secondary-container',
    'on-secondary-fixed',
    'on-secondary-fixed-variant',
    'on-surface',
    'on-surface-variant',
    'on-tertiary',
    'on-tertiary-container',
    'on-tertiary-fixed',
    'on-tertiary-fixed-variant',
    'outline',
    'outline-variant',
    'primary',
    'primary-container',
    'primary-fixed',
    'primary-fixed-dim',
    'scrim',
    'secondary',
    'secondary-container',
    'secondary-fixed',
    'secondary-fixed-dim',
    'shadow',
    'surface',
    'surface-bright',
    'surface-container',
    'surface-container-high',
    'surface-container-highest',
    'surface-container-low',
    'surface-container-lowest',
    'surface-dim',
    'surface-tint',
    'surface-variant',
    'tertiary',
    'tertiary-container',
    'tertiary-fixed',
    'tertiary-fixed-dim',
  ];

  protected toClipboard(color: string) {
    this.#document.defaultView?.navigator.clipboard.writeText(color);
  }
}
