import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialColorsMap } from './color-demo.types';
import { ElementToBgColorPipe } from './element-to-bg-color.pipe';

@Component({
  selector: 'app-color-demo',
  host: { class: 'app-color-demo' },
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ElementToBgColorPipe,
  ],
  templateUrl: './color-demo.component.html',
  styleUrl: './color-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorDemoComponent {
  #document = inject(DOCUMENT);

  protected displayHexColor = true;

  // Learn more about Material color roles:
  //    - https://material.angular.io/guide/system-variables
  //    - https://m3.material.io/styles/color/roles
  protected materialColorsMap: MaterialColorsMap[] = [
    {
      heading: 'Primary',
      roles: ['primary', 'on-primary', 'primary-container', 'on-primary-container'],
    },

    {
      heading: 'Secondary',
      roles: ['secondary', 'on-secondary', 'secondary-container', 'on-secondary-container'],
    },

    {
      heading: 'Tertiary',
      roles: ['tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container'],
    },

    {
      heading: 'Error',
      roles: ['error', 'on-error', 'error-container', 'on-error-container'],
    },

    {
      heading: 'Outline',
      roles: ['outline', 'outline-variant'],
    },

    {
      heading: 'Surface',
      roles: [
        // 'background', // Same as 'surface'
        // 'on-background', // Same as 'on-surface'

        'surface',
        'on-surface',

        'surface-variant',
        'on-surface-variant',

        'surface-container-lowest',
        'surface-container-low',
        'surface-container',
        'surface-container-high',
        'surface-container-highest',
        'surface-dim',
        'surface-bright',
        'surface-tint',
      ],
    },

    {
      heading: 'Primary fixed',
      roles: ['primary-fixed', 'primary-fixed-dim', 'on-primary-fixed', 'on-primary-fixed-variant'],
    },

    {
      heading: 'Secondary fixed',
      roles: ['secondary-fixed', 'secondary-fixed-dim', 'on-secondary-fixed', 'on-secondary-fixed-variant'],
    },

    {
      heading: 'Tertiary fixed',
      roles: ['tertiary-fixed', 'tertiary-fixed-dim', 'on-tertiary-fixed', 'on-tertiary-fixed-variant'],
    },

    {
      heading: 'Inverse',
      roles: ['inverse-primary', 'inverse-surface', 'inverse-on-surface'],
    },

    {
      heading: 'Miscellaneous',
      roles: [
        // 'scrim', // Same as shadow
        'shadow',
      ],
    },
  ];

  protected roleFilter = signal('');

  protected materialColorsMapFiltered = computed<MaterialColorsMap[]>(() => {
    const roleFilter = this.roleFilter();
    return this.materialColorsMap
      .map((colors) => ({
        heading: colors.heading,
        roles: colors.roles.filter((role) => role.includes(roleFilter)),
      }))
      .filter((colors) => colors.roles.length);
  });

  protected toClipboard(color: string) {
    this.#document.defaultView?.navigator.clipboard.writeText(color);
  }
}
