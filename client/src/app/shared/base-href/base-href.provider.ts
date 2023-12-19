import { APP_BASE_HREF, PlatformLocation } from '@angular/common';

export const provideBaseHref = () => ({
  provide: APP_BASE_HREF,
  useFactory: (platformLocation: PlatformLocation): string => platformLocation.getBaseHrefFromDOM(),
  deps: [PlatformLocation],
});
