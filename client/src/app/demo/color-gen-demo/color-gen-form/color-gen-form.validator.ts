import { AbstractControl, ValidationErrors } from '@angular/forms';

export const HEX_COLOR_ERROR_KEY = 'hexColor';

export const hexColorValidator = (control: AbstractControl): ValidationErrors | null =>
  (control.value as string | null | undefined)?.match(/^#?[0-9abcdef]{6}$/i) ? null : { [HEX_COLOR_ERROR_KEY]: true };
