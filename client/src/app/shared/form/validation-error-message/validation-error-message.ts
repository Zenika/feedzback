import { ValidationErrors } from '@angular/forms';
import { AllowedEmailDomainsError } from '../allowed-email-domains/allowed-email-domains.types';
import { ALLOWED_EMAIL_DOMAINS_ERROR_KEY } from '../allowed-email-domains/allowed-email-domains.validator';
import { StringArrayError } from '../emails-validation-error.types';
import { FORBIDDEN_VALUES_KEY } from '../forbidden-values';
import { MULTIPLE_EMAILS_ERROR_KEY } from '../multiple-emails';

export const getValidationErrorMessage = (errors: ValidationErrors | null): string | null => {
  if (errors?.['required']) {
    return $localize`:@@FieldError.Required:Champ obligatoire`;
  }
  if (errors?.['email']) {
    return $localize`:@@FieldError.Email:Email invalide`;
  }
  if (errors?.[MULTIPLE_EMAILS_ERROR_KEY]) {
    const error: StringArrayError = errors?.[MULTIPLE_EMAILS_ERROR_KEY];
    if (error.fieldValues.length === 1) {
      return $localize`:@@FieldError.MultipleEmail:Email invalide : ` + error.fieldValues.join(', ');
    } else {
      return $localize`:@@FieldError.MultipleEmails:Emails invalides : ` + error.fieldValues.join(', ');
    }
  }
  if (errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY]) {
    const error: AllowedEmailDomainsError = errors?.[ALLOWED_EMAIL_DOMAINS_ERROR_KEY];
    const message = error.domains.map((domain) => `@${domain}`).join(' ' + $localize`:@@Word.Or:ou` + ' ');
    return $localize`:@@FieldError.AllowedEmailDomains:L'email doit se terminer par : ` + message;
  }
  if (errors?.[FORBIDDEN_VALUES_KEY]) {
    const error: StringArrayError = errors?.[FORBIDDEN_VALUES_KEY];
    if (error.fieldValues.length === 1) {
      return $localize`:@@FieldError.ForbiddenValue:Valeur non autorisée : ` + error.fieldValues.join(', ');
    } else {
      return $localize`:@@FieldError.ForbiddenValues:Valeurs non autorisées : ` + error.fieldValues.join(', ');
    }
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
