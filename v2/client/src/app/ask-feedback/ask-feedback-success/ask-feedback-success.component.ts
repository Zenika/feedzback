import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AskFeedbackSuccess } from './ask-feedback-success.types';

@Component({
  selector: 'app-ask-feedback-success',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './ask-feedback-success.component.html',
  styleUrls: ['./ask-feedback-success.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AskFeedbackSuccessComponent {
  @HostBinding('class.app-ask-feedback-success') hasCss = true;

  @HostBinding('class.gbl-info') hasGlobalCss = true;

  protected state: AskFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;
}
