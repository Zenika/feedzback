import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RequestFeedbackSuccess } from './request-feedback-success.types';

@Component({
  selector: 'app-request-feedback-success',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './request-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestFeedbackSuccessComponent {
  @HostBinding('class.app-request-feedback-success') hasCss = true;

  @HostBinding('class.gbl-info') hasGlobalCss = true;

  protected state: RequestFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;
}
