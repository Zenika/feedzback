import { ValidationErrors } from '@angular/forms';
import { ALLOWED_EMAIL_DOMAINS_ERROR_KEY } from '../allowed-email-domains/allowed-email-domains.validator';
import { FORBIDDEN_VALUES_KEY } from '../forbidden-values';
import { MULTIPLE_EMAILS_ERROR_KEY } from '../multiple-emails';

export const getValidationErrorMessage = (errors: ValidationErrors | null): string | null => {
  if (errors?.['required']) {
    return $localize`:@@ValidationError.Required:Champ requis`;
  }
  if (errors?.['email']) {
    return $localize`:@@ValidationError.Email:Email invalide`;
  }
  if (errors?.[MULTIPLE_EMAILS_ERROR_KEY]?.length > 0) {
    return (
      $localize`:@@ValidationError.MultipleEmails:Email(s) invalide(s) : ` +
      errors?.[MULTIPLE_EMAILS_ERROR_KEY].join(', ')
    );
  }
  if (errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY]) {
    return (
      $localize`:@@ValidationError.AllowedEmailDomains:L'email doit se terminer par : ` +
      `@${errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY].join(', @')}`
    );
  }
  if (errors?.[FORBIDDEN_VALUES_KEY]) {
    return (
      $localize`:@@ValidationError.ForbiddenValues:Valeur non autorisée : ` + errors?.[FORBIDDEN_VALUES_KEY].join(', ')
    );
  }
  if (errors?.['minlength']) {
    return errors?.['minlength'].requiredLength + $localize`:@@ValidationError.MinLength: charactères au minimum`;
  }
  if (errors?.['maxlength']) {
    return errors?.['maxlength'].requiredLength + $localize`:@@ValidationError.MaxLength: charactères au maximum`;
  }
  if (errors?.['min']) {
    return $localize`:@@ValidationError.Min:Minimum ` + errors?.['min'].requiredLength;
  }
  if (errors?.['max']) {
    return $localize`:@@ValidationError.Max:Maximum ` + errors?.['max'].requiredLength;
  }
  if (errors?.['pattern']) {
    return $localize`:@@ValidationError.Pattern:Format invalide`;
  }
  return null;
};
