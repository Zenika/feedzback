import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FocusContentService {
  private router = inject(Router);

  private routeTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => {
      let routeTitle: string | undefined;
      let routeSnapshot: ActivatedRouteSnapshot | undefined = this.router.routerState.snapshot.root;
      while (routeSnapshot) {
        if (routeSnapshot.title) {
          routeTitle = routeSnapshot.title;
        }
        routeSnapshot = routeSnapshot.children.find(({ outlet }) => outlet === 'primary');
      }
      return routeTitle;
    }),
    distinctUntilChanged(),
    tap(() => this.focusTop()),
  );

  routeTitle = toSignal(this.routeTitle$);

  topElement?: HTMLElement;

  mainElement?: HTMLElement;

  focusTop() {
    this.topElement?.focus();
  }

  focusMain() {
    this.mainElement?.focus();
  }
}
