import { Pipe, PipeTransform, inject } from '@angular/core';
import { ALLOWED_EMAIL_DOMAINS } from './allowed-email-domain.provider';
import { isAllowedEmailDomain } from './allowed-email-domains';

@Pipe({
  name: 'allowedEmailDomains',
  standalone: true,
})
export class AllowedEmailDomainsPipe implements PipeTransform {
  private allowedEmailDomains = inject(ALLOWED_EMAIL_DOMAINS);

  transform(email: string): boolean {
    return isAllowedEmailDomain(email, this.allowedEmailDomains);
  }
}
