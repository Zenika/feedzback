import { Component, effect, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { PreRequestFeedbackTokenComponent } from './pre-request-feedback-token/pre-request-feedback-token.component';
import { RequestFeedbackComponent } from './request-feedback/request-feedback.component';

@Component({
  selector: 'app-request',
  host: { class: 'app-request' },
  imports: [MatIconModule, MatTabsModule, PreRequestFeedbackTokenComponent, RequestFeedbackComponent],
  templateUrl: './request.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestComponent {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  method = input.required<string>();

  protected tabIndex = signal(0);

  constructor() {
    effect(() => {
      const method = this.method();
      if (method !== 'send' && method !== 'generate') {
        this.updateMethod(0);
      } else {
        this.tabIndex.set(method === 'send' ? 0 : 1);
      }
    });
  }

  protected updateMethod(tabIndex: number) {
    this.router.navigate(['../', tabIndex === 0 ? 'send' : 'generate'], { relativeTo: this.activatedRoute });
  }
}
