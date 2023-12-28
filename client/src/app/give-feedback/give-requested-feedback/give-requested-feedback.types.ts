import { FeedbackRequest, TokenObject } from '../../shared/feedback/feedback.types';

export type GiveRequestedFeedbackData = {
  requestWithToken?: RequestWithToken;
};

export type RequestWithToken = FeedbackRequest & TokenObject;
