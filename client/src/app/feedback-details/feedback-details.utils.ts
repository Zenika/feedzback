import { Feedback, FeedbackRequest, FeedbackType } from '../shared/feedback/feedback.types';

export const inferFeedbackType = (
  { senderEmail, receiverEmail, status }: Feedback | FeedbackRequest,
  viewerEmail: string,
): FeedbackType | null => {
  switch (status) {
    case 'done': {
      if (viewerEmail === senderEmail) {
        return FeedbackType.given;
      }
      if (viewerEmail === receiverEmail) {
        return FeedbackType.received;
      }
      break;
    }
    case 'pending': {
      if (viewerEmail === senderEmail) {
        return FeedbackType.receivedRequest;
      }
      if (viewerEmail === receiverEmail) {
        return FeedbackType.sentRequest;
      }
      break;
    }
  }
  return null;
};
