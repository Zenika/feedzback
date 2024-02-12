import { AbstractControl, ValidationErrors } from '@angular/forms';
import { StringArrayError } from '../emails-validation-error.types';
import { isAllowedEmailDomain } from './allowed-email-domains';
import { AllowedEmailDomainsError } from './allowed-email-domains.types';

export const ALLOWED_EMAIL_DOMAINS_ERROR_KEY = 'allowedEmailDomains';

export const allowedEmailDomainsValidatorFactory =
  (domains: string[]) =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlValue: string[] | string | null | undefined = control.value;

    const values = controlValue ? (Array.isArray(controlValue) ? controlValue : [controlValue]) : [];

    const emailErrors = values.filter((value) => !isAllowedEmailDomain(value, domains));

    if (emailErrors.length === 0) {
      return null;
    }
    return {
      [ALLOWED_EMAIL_DOMAINS_ERROR_KEY]: {
        fieldValues: emailErrors,
        domains,
      } satisfies StringArrayError & AllowedEmailDomainsError,
    };
  };
