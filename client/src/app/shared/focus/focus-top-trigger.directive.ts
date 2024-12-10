import { Directive, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, Router } from '@angular/router';
import { FocusService } from './focus.service';

@Directive({
  selector: '[appFocusTopTrigger]',
  host: {
    '(click)': 'focusTop()',
  },
})
export class FocusTopTriggerDirective {
  private router = inject(Router);

  private navigationEndLikeEvents = [NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped];

  private focusService = inject(FocusService);

  focusTop() {
    const subscription = this.router.events.subscribe((event) => {
      if (this.navigationEndLikeEvents.some((navigationEndLikeEvent) => event instanceof navigationEndLikeEvent)) {
        subscription.unsubscribe();
      }
      if (event instanceof NavigationEnd) {
        this.focusService.focusTop();
      }
    });
  }
}
