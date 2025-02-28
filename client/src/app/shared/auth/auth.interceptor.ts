import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { concatMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BYPASS_AUTHORIZATION } from './auth.config';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBaseUrl) || req.context.get(BYPASS_AUTHORIZATION)) {
    return next(req);
  }
  return inject(AuthService)
    .getIdToken()
    .pipe(concatMap((idToken) => next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${idToken}`) }))));
};
