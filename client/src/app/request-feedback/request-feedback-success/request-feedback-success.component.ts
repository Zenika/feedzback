import { Component, DOCUMENT, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CopyToClipboardComponent } from '../../shared/copy-to-clipboard';
import { RequestFeedbackSuccess } from './request-feedback-success.types';

@Component({
  selector: 'app-request-feedback-success',
  host: { class: 'gbl-info' },
  imports: [RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, CopyToClipboardComponent],
  templateUrl: './request-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestFeedbackSuccessComponent {
  protected state?: RequestFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;
}
