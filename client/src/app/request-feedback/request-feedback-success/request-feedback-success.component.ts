import { Component, DOCUMENT, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { RequestFeedbackSuccess } from './request-feedback-success.types';

@Component({
  selector: 'app-request-feedback-success',
  host: { class: 'gbl-info' },
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './request-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestFeedbackSuccessComponent {
  private document = inject(DOCUMENT);

  protected state?: RequestFeedbackSuccess = this.document.defaultView?.history.state;

  protected toClipboard(linkToShare: string) {
    this.document.defaultView?.navigator.clipboard.writeText(linkToShare);
  }
}
