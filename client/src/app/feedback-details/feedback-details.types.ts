import { Feedback, FeedbackRequest, FeedbackType } from '../shared/feedback/feedback.types';

export type FeedbackDetails = {
  feedback: Feedback | FeedbackRequest;
  type: FeedbackType;
};
