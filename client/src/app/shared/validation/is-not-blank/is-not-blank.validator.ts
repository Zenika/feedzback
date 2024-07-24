import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Ensure the control value is required and not full of blank spaces
 * (it is more restrictive than the native Angular `Validators.required`).
 */
export const isNotBlankValidator = (control: AbstractControl): ValidationErrors | null => {
  const controlValue: string | null | undefined = control.value;
  if (!controlValue || controlValue.trim() === '') {
    return { required: true }; // Same return as native Angular `Validators.required` error
  }
  return null;
};
