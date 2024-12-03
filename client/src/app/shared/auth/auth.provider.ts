import { inject, provideAppInitializer } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export const provideAuth = () => provideAppInitializer(() => firstValueFrom(inject(AuthService).user$));
