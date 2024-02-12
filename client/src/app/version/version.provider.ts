import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { VersionService } from './version.service';

export const provideVersion = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (versionService: VersionService) => (): Promise<unknown> => versionService.init(),
  deps: [VersionService],
  multi: true,
});
