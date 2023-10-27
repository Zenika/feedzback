import { AbstractControl } from '@angular/forms';

export const getFormControlError = (control: AbstractControl): string | null => {
  if (control.hasError('required')) {
    return 'Champ requis';
  }
  if (control.hasError('email')) {
    return 'Adresse email invalide';
  }
  if (control.hasError('minlength')) {
    return `Minimum ${control.errors?.['minlength'].requiredLength} charactères`;
  }
  if (control.hasError('maxlength')) {
    return `Maximum ${control.errors?.['maxlength'].requiredLength} charactères`;
  }
  if (control.hasError('min')) {
    return `Minimum ${control.errors?.['min'].requiredLength}`;
  }
  if (control.hasError('max')) {
    return `Maximum ${control.errors?.['max'].requiredLength}`;
  }
  if (control.hasError('pattern')) {
    return 'Champ invalide';
  }
  return null;
};
