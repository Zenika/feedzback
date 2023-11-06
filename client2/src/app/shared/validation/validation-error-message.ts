import { ValidationErrors } from '@angular/forms';

export const getValidationErrorMessage = (errors: ValidationErrors | null): string | null => {
  if (errors?.['required']) {
    return 'Champ requis';
  }
  if (errors?.['email']) {
    return 'Email invalide';
  }
  if (errors?.['multipleEmails']?.length > 0) {
    return `Email(s) invalide(s): ${errors?.['multipleEmails'].join(', ')}`;
  }
  if (errors?.['allowedEmailDomains']) {
    return `Domaine(s) autorisé(s): ${errors?.['allowedEmailDomains'].join(', ')}`;
  }
  if (errors?.['minlength']) {
    return `${errors?.['minlength'].requiredLength} charactères au minimum`;
  }
  if (errors?.['maxlength']) {
    return `${errors?.['maxlength'].requiredLength} charactères au maximum`;
  }
  if (errors?.['min']) {
    return `Minimum ${errors?.['min'].requiredLength}`;
  }
  if (errors?.['max']) {
    return `Maximum ${errors?.['max'].requiredLength}`;
  }
  if (errors?.['pattern']) {
    return 'Format invalide';
  }
  return null;
};
