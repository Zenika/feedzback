import { Feedback, FeedbackRequest, FeedbackType } from '../shared/feedback/feedback.types';

export interface FeedbackDetails {
  feedback: Feedback | FeedbackRequest;
  type: FeedbackType;
}
