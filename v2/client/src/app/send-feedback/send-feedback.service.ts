import { Injectable } from '@angular/core';
import { AskedFeedback } from '../shared/feedback/feedback.types';

@Injectable({
  providedIn: 'root',
})
export class SendFeedbackService {
  askedFeedback?: AskedFeedback;

  init() {
    this.askedFeedback = undefined;
  }

  set(value: AskedFeedback) {
    this.askedFeedback = value;
  }
}
