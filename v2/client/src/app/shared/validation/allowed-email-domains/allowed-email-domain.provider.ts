import { InjectionToken, ValueProvider } from '@angular/core';

export const ALLOWED_EMAIL_DOMAINS = new InjectionToken<string[]>('ALLOWED_EMAIL_DOMAINS');

export const provideAllowedEmailDomains = (domains: string[]): ValueProvider => ({
  provide: ALLOWED_EMAIL_DOMAINS,
  useValue: domains,
});
