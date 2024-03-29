import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from './loading.service';

export const loadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }
  const loadingService = inject(LoadingService);
  loadingService.queue(req);
  return next(req).pipe(finalize(() => loadingService.unqueue(req)));
};
