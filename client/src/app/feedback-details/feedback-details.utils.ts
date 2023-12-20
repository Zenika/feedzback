import { Feedback, FeedbackRequest, FeedbackType } from '../shared/feedback/feedback.types';

export const inferFeedbackType = (
  { giverEmail, receiverEmail, status }: Feedback | FeedbackRequest,
  viewerEmail: string,
): FeedbackType | null => {
  switch (status) {
    case 'done': {
      if (viewerEmail === giverEmail) {
        return FeedbackType.given;
      }
      if (viewerEmail === receiverEmail) {
        return FeedbackType.received;
      }
      break;
    }
    case 'pending': {
      if (viewerEmail === giverEmail) {
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
