import { inject, provideEnvironmentInitializer } from '@angular/core';
import { SessionService } from './session.service';

export const provideSession = () => provideEnvironmentInitializer(() => inject(SessionService).init());
