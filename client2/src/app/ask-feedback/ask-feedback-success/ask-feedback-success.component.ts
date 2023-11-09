import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AskFeedbackSuccess } from './ask-feedback-success.types';

@Component({
  selector: 'app-ask-feedback-success',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, MatIconModule],
  templateUrl: './ask-feedback-success.component.html',
  styleUrls: ['./ask-feedback-success.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AskFeedbackSuccessComponent {
  @HostBinding('class.app-ask-feedback-success') hasCss = true;

  protected state: AskFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;
}
