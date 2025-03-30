import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

export const HEX_COLOR_REGEXP = /^#?([0-9abcdef]{3}|[0-9abcdef]{6})$/i;

export const HEX_COLOR_ERROR_KEY = 'hexColor';

export const hexColorValidator = (control: AbstractControl): ValidationErrors | null =>
  (control.value as string | null | undefined)?.match(HEX_COLOR_REGEXP) ? null : { [HEX_COLOR_ERROR_KEY]: true };

export const RANGE_ERROR_KEY = 'range';

export const rangeValidatorFactory =
  (startCtrlName = 'start', endCtrlName = 'end') =>
  (control: AbstractControl): ValidationErrors | null => {
    const startValue: number | null | undefined = control.get(startCtrlName)?.value;
    const endValue: number | null | undefined = control.get(endCtrlName)?.value;

    return typeof startValue === 'number' && typeof endValue === 'number' && startValue >= endValue
      ? { [RANGE_ERROR_KEY]: true }
      : null;
  };

export const asyncRangeParentValidator: AsyncValidatorFn = (control) => {
  let resolve: (value: ValidationErrors | null) => void;
  // Note: we have to wait for the parent validator error to be set
  setTimeout(() => resolve(control.parent?.getError(RANGE_ERROR_KEY) ? { [RANGE_ERROR_KEY]: true } : null));
  return new Promise((_resolve) => (resolve = _resolve));
};
