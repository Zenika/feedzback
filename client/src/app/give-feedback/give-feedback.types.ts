import { FeedbackRequest, TokenObject } from '../shared/feedback/feedback.types';

export type GiveFeedbackData = {
  requestWithToken?: RequestWithToken;
};

export type RequestWithToken = FeedbackRequest & TokenObject;
