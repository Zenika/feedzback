import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isAllowedEmailDomain } from './allowed-email-domains';

export const ALLOWED_EMAIL_DOMAINS_ERROR_KEY = 'allowedEmailDomains';

export const allowedEmailDomainsValidatorFactory =
  (domains: string[]) =>
  (control: AbstractControl): ValidationErrors | null => {
    const controlValue: string[] | string | null | undefined = control.value;

    const values = controlValue ? (Array.isArray(controlValue) ? controlValue : [controlValue]) : [];

    const emailsErrors = values.filter((value) => !isAllowedEmailDomain(value, domains));

    return emailsErrors.length === 0 ? null : { [ALLOWED_EMAIL_DOMAINS_ERROR_KEY]: emailsErrors };
  };
