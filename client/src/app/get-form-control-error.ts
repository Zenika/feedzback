/* eslint-disable dot-notation */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const getFormControlError = (
  control: AbstractControl
): String | null => {
  const errors: ValidationErrors = control.errors!;

  if (control.hasError('required')) return 'Champ requis';
  if (control.hasError('email')) return 'Adresse email invalide';
  if (control.hasError('minlength'))
    return `Minimum ${errors['minlength'].requiredLength} charactères`;
  if (control.hasError('maxlength'))
    return `Maximum ${errors['maxlength'].requiredLength} charactères`;
  if (control.hasError('min')) return `Minimum ${errors['min'].requiredLength}`;
  if (control.hasError('max')) return `Maximum ${errors['max'].requiredLength}`;
  if (control.hasError('pattern')) return `Champ invalide`;
  return null;
};
