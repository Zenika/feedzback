import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BYPASS_LOADING } from './loading.config';
import { LoadingService } from './loading.service';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  if (!req.url.startsWith(environment.apiBaseUrl) || req.context.get(BYPASS_LOADING)) {
    return next(req);
  }
  const loadingService = inject(LoadingService);
  loadingService.queue(req);
  return next(req).pipe(finalize(() => loadingService.unqueue(req)));
};
