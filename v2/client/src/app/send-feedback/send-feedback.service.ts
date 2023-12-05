import { Injectable } from '@angular/core';
import { AskedFeedback } from '../shared/feedback/feedback.types';

@Injectable({
  providedIn: 'root',
})
export class SendFeedbackService {
  token?: string;
  askedFeedback?: AskedFeedback;

  init() {
    this.token = undefined;
    this.askedFeedback = undefined;
  }

  set(token: string, value: AskedFeedback) {
    this.token = token;
    this.askedFeedback = value;
  }
}
