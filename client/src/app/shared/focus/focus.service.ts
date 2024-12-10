import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FocusService {
  private router = inject(Router);

  routeTitle = toSignal(
    this.router.events.pipe(
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
    ),
  );

  topTarget?: HTMLElement;

  mainTarget?: HTMLElement;

  focusTop() {
    this.topTarget?.focus();
  }

  focusMain() {
    this.mainTarget?.focus();
  }
}
