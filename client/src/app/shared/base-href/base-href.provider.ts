import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { FactoryProvider } from '@angular/core';

export const provideBaseHref = (): FactoryProvider => ({
  provide: APP_BASE_HREF,
  useFactory: (platformLocation: PlatformLocation): string => platformLocation.getBaseHrefFromDOM(),
  deps: [PlatformLocation],
});
