import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Ensure the control value is NOT full of blank spaces
 *
 * @description
 * This validator does NOT replace the native Angular `Validators.required`.
 * It only checks that if the control value is a non-empty string, it is not composed entirely of blank spaces.
 *
 * This validator was designed this way to force the developer to add the native Angular `Validators.required`.
 * It is important because Angular automatically adds an asterisk in the label of mandatory fields.
 *
 * @example
 * ```ts
 * const control = new FormControl('', [Validators.required, isNotBlankValidator]);
 * ```
 */
export const isNotBlankValidator = (control: AbstractControl): ValidationErrors | null => {
  const controlValue: string | null | undefined = control.value;

  // This validator does NOT replace the native Angular `Validators.required`.
  // Therefore, empty string, null or undefined are all valid values.
  if (!controlValue) {
    return null;
  }

  if (controlValue.trim() === '') {
    return { required: true }; // Same return as native Angular `Validators.required` error
  }
  return null;
};
