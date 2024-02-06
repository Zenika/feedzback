import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RequestFeedbackSuccess } from './request-feedback-success.types';

@Component({
  selector: 'app-request-feedback-success',
  host: { class: 'gbl-info' },
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './request-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestFeedbackSuccessComponent {
  protected state: RequestFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;
}
