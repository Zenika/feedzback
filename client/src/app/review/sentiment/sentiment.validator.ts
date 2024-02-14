import { AbstractControl, ValidationErrors } from '@angular/forms';

export const requiredSentimentValidator = (control: AbstractControl): ValidationErrors | null => {
  if (control.value === 0) {
    return { required: true }; // Same return as native Angular `Validators.required` error
  }
  return null;
};
