import { inject, provideAppInitializer } from '@angular/core';
import { tap } from 'rxjs';
import { SessionService } from './session.service';

export const provideSession = () =>
  provideAppInitializer(() => {
    const sessionService = inject(SessionService);
    return sessionService.checkIdleOnLoad().pipe(tap(() => sessionService.startIdleEventHandling()));
  });
