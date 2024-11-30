import { Directive, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, Router } from '@angular/router';
import { FocusContentService } from './focus-content.service';

@Directive({
  selector: '[appFocusContentOnRouting]',
  host: {
    '(click)': 'focus()',
  },
})
export class FocusContentOnRoutingDirective {
  private router = inject(Router);

  private navigationEndLikeEvents = [NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped];

  private focusContentService = inject(FocusContentService);

  focus() {
    const subscription = this.router.events.subscribe((event) => {
      if (this.navigationEndLikeEvents.some((navigationEndLikeEvent) => event instanceof navigationEndLikeEvent)) {
        subscription.unsubscribe();
      }
      if (event instanceof NavigationEnd) {
        this.focusContentService.focusTarget();
      }
    });
  }
}
