import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isAllowedEmailDomain } from './allowed-email-domains';

export const ALLOWED_EMAIL_DOMAINS_ERROR_KEY = 'allowedEmailDomains';

export const allowedEmailDomainsValidatorFactory =
  (domains: string[]) =>
  (control: AbstractControl): ValidationErrors | null =>
    isAllowedEmailDomain(control.value, domains) ? null : { [ALLOWED_EMAIL_DOMAINS_ERROR_KEY]: domains };
