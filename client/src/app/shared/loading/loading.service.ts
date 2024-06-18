import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoadingRequest, LoadingTimeout } from './loading.types';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingMap = new Map<LoadingRequest, LoadingTimeout>();

  private _loading = signal(false);

  loading = this._loading.asReadonly();

  readonly DELAY = 1000;

  constructor() {
    let request: LoadingRequest = { url: '' };

    inject(Router)
      .events.pipe(
        takeUntilDestroyed(),
        tap((event) => {
          if (event instanceof NavigationStart) {
            request = { url: event.url };
            this.queue(request);
          }
          if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
            this.unqueue(request);
            request = { url: '' };
          }
        }),
      )
      .subscribe();
  }

  queue(req: LoadingRequest) {
    this.loadingMap.set(req, setTimeout(() => this._loading.set(true), this.DELAY) as unknown as LoadingTimeout);
  }

  unqueue(req: LoadingRequest) {
    if (!this.loadingMap.has(req)) {
      return;
    }

    clearTimeout(this.loadingMap.get(req));
    this.loadingMap.delete(req);

    if (this.loadingMap.size === 0) {
      this._loading.set(false);
    }
  }

  flush() {
    if (this.loadingMap.size === 0) {
      return;
    }

    this.loadingMap.forEach((timeout) => clearTimeout(timeout));
    this.loadingMap.clear();
    this._loading.set(false);
  }
}
