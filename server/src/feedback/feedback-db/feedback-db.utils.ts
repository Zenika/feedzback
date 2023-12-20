import { FeedbackRequestWithId, FeedbackWithId, TypedFeedbacks } from './feedback-db.types';

type AnyFeedbackWithId = FeedbackWithId | FeedbackRequestWithId;

export const isReceivedFeedback = (value: AnyFeedbackWithId, userEmail: string): value is FeedbackWithId =>
  value.status === 'done' && value.receiverEmail === userEmail;

export const isGivenFeedback = (value: AnyFeedbackWithId, userEmail: string): value is FeedbackWithId =>
  value.status === 'done' && value.senderEmail === userEmail;

export const isSentFeedbackRequest = (value: AnyFeedbackWithId, userEmail: string): value is FeedbackRequestWithId =>
  value.status === 'pending' && value.receiverEmail === userEmail;

export const isReceivedFeedbackRequest = (
  value: AnyFeedbackWithId,
  userEmail: string,
): value is FeedbackRequestWithId => value.status === 'pending' && value.senderEmail === userEmail;

export const mapToTypedFeedbacks = (feedbacks: AnyFeedbackWithId[], userEmail: string): TypedFeedbacks =>
  feedbacks.reduce(
    (list, feedback) => {
      if (isReceivedFeedback(feedback, userEmail)) list.received.push(feedback);
      else if (isGivenFeedback(feedback, userEmail)) list.given.push(feedback);
      else if (isSentFeedbackRequest(feedback, userEmail)) list.sentRequest.push(feedback);
      else if (isReceivedFeedbackRequest(feedback, userEmail)) list.receivedRequest.push(feedback);
      return list;
    },
    {
      received: [],
      given: [],
      sentRequest: [],
      receivedRequest: [],
    } satisfies TypedFeedbacks as TypedFeedbacks,
  );
