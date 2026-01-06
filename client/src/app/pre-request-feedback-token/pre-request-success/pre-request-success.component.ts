import { Component, DOCUMENT, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PreRequestSuccessState } from './pre-request-success.types';

@Component({
  selector: 'app-pre-request-success',
  host: { class: 'gbl-info' },
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './pre-request-success.component.html',
})
export class PreRequestFeedbackTokenSuccessComponent {
  private document = inject(DOCUMENT);

  private state: PreRequestSuccessState = this.document.defaultView?.history.state;

  protected linkToShare = `${this.document.location.protocol}//${this.document.location.host}/pre-request-email/token/${this.state.token}`;

  protected toClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.linkToShare);
  }
}
