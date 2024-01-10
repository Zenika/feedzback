import { ValidationErrors } from '@angular/forms';
import { ALLOWED_EMAIL_DOMAINS_ERROR_KEY } from '../allowed-email-domains/allowed-email-domains.validator';
import { FORBIDDEN_VALUES_KEY } from '../forbidden-values';
import { MULTIPLE_EMAILS_ERROR_KEY } from '../multiple-emails';

export const getValidationErrorMessage = (errors: ValidationErrors | null): string | null => {
  if (errors?.['required']) {
    return $localize`:@@FieldError.Required:Champ requis`;
  }
  if (errors?.['email']) {
    return $localize`:@@FieldError.Email:Email invalide`;
  }
  if (errors?.[MULTIPLE_EMAILS_ERROR_KEY]?.length > 0) {
    return (
      $localize`:@@FieldError.MultipleEmails:Email(s) invalide(s) : ` + errors?.[MULTIPLE_EMAILS_ERROR_KEY].join(', ')
    );
  }
  if (errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY]) {
    return (
      $localize`:@@FieldError.AllowedEmailDomains:L'email doit se terminer par : ` +
      `@${errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY].join(', @')}`
    );
  }
  if (errors?.[FORBIDDEN_VALUES_KEY]) {
    return $localize`:@@FieldError.ForbiddenValues:Valeur non autorisée : ` + errors?.[FORBIDDEN_VALUES_KEY].join(', ');
  }
  if (errors?.['minlength']) {
    return errors?.['minlength'].requiredLength + $localize`:@@FieldError.MinLength: caractères au minimum`;
  }
  if (errors?.['maxlength']) {
    return errors?.['maxlength'].requiredLength + $localize`:@@FieldError.MaxLength: caractères au maximum`;
  }
  if (errors?.['min']) {
    return $localize`:@@FieldError.Min:Minimum ` + errors?.['min'].requiredLength;
  }
  if (errors?.['max']) {
    return $localize`:@@FieldError.Max:Maximum ` + errors?.['max'].requiredLength;
  }
  if (errors?.['pattern']) {
    return $localize`:@@FieldError.Pattern:Format invalide`;
  }
  return null;
};
