import { ValidationErrors } from '@angular/forms';
import { ALLOWED_EMAIL_DOMAINS_ERROR_KEY } from '../allowed-email-domains/allowed-email-domains.validator';
import { MULTIPLE_EMAILS_ERROR_KEY } from '../multiple-emails';

export const getValidationErrorMessage = (errors: ValidationErrors | null): string | null => {
  if (errors?.['required']) {
    return 'Champ requis';
  }
  if (errors?.['email']) {
    return 'Email invalide';
  }
  if (errors?.[MULTIPLE_EMAILS_ERROR_KEY]?.length > 0) {
    return `Email(s) invalide(s): ${errors?.[MULTIPLE_EMAILS_ERROR_KEY].join(', ')}`;
  }
  if (errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY]) {
    return `Domaine autorisé: ${errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY].join(', ')}`;
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
