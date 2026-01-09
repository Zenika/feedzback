import { Component, DOCUMENT, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PreRequestFeedbackSuccess } from './pre-request-feedback-success.types';

@Component({
  selector: 'app-pre-request-feedback-success',
  host: { class: 'gbl-info' },
  imports: [MatIconModule],
  templateUrl: './pre-request-feedback-success.component.html',
})
export class PreRequestFeedbackSuccessComponent {
  private document = inject(DOCUMENT);

  protected state?: PreRequestFeedbackSuccess = this.document.defaultView?.history.state;
}
