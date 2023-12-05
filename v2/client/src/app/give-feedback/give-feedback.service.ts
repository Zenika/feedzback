import { Injectable } from '@angular/core';
import { FeedbackRequest } from '../shared/feedback/feedback.types';

@Injectable({
  providedIn: 'root',
})
export class GiveFeedbackService {
  token?: string;
  request?: FeedbackRequest;

  init() {
    this.token = undefined;
    this.request = undefined;
  }

  set(token: string, request: FeedbackRequest) {
    this.token = token;
    this.request = request;
  }
}
