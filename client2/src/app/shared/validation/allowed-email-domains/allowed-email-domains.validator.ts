import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isAllowedEmailDomain } from './allowed-email-domains';

export const allowedEmailDomainsValidatorFactory =
  (domains: string[]) =>
  (control: AbstractControl): ValidationErrors | null =>
    isAllowedEmailDomain(control.value, domains) ? null : { allowedEmailDomains: domains };
