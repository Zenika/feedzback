import { Injectable } from '@angular/core';

export type AskedFeedbackDetails = {
  senderEmail: string;
  receiverEmail: string;
  recipientToken: string;
};

@Injectable({
  providedIn: 'root',
})
export class SendFeedbackService {
  askedFeedbackDetails?: AskedFeedbackDetails;

  init() {
    this.askedFeedbackDetails = undefined;
  }

  set(value: AskedFeedbackDetails) {
    this.askedFeedbackDetails = value;
  }
}
