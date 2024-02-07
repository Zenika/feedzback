import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// YOU CAN SAFELY REMOVE THIS COMPONENT IN MARCH 2024... //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

@Component({
  selector: 'app-feedback-details-temporary-redirect',
  standalone: true,
  template: '',
})
export class FeedbackDetailsTemporaryRedirectComponent {
  constructor() {
    // Redirect users to the new route path...
    const feedbackId = inject(ActivatedRoute).snapshot.params['id'];
    inject(Router).navigate(['/history/id', feedbackId]);
  }
}
