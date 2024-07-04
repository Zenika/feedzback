import { Directive, computed, input } from '@angular/core';
import { IconAnimation, IconPull, IconSize } from './icon.types';
import { mapToIconClass } from './icon.utils';

/**
 * Enhancing the Material icon component (`mat-icon`)
 *
 * @example
 * ```html
 * <mat-icon appIcon size="xl" pull="left" animation="beat">home</mat-icon>
 * ```
 */
@Directive({
  selector: '[appIcon]',
  host: {
    '[class]': 'hostClass()',
  },
  standalone: true,
})
export class IconDirective {
  size = input('', { transform: mapToIconClass<IconSize> });

  pull = input('', { transform: mapToIconClass<IconPull> });

  animation = input('', { transform: mapToIconClass<IconAnimation> });

  protected hostClass = computed(() =>
    ['app-icon', this.size(), this.pull(), this.animation()].filter((value) => value).join(' '),
  );
}
