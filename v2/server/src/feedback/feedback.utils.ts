import { AskedFeedbackWithId, FeedbackWithId, TypedFeedbacks } from './feedback.types';

type AnyFeedbackWithId = FeedbackWithId | AskedFeedbackWithId;

export const isReceivedFeedback = (value: AnyFeedbackWithId, userEmail: string): value is FeedbackWithId =>
  value.status === 'given' && value.receiverEmail === userEmail;

export const isSentFeedback = (value: AnyFeedbackWithId, userEmail: string): value is FeedbackWithId =>
  value.status === 'given' && value.senderEmail === userEmail;

export const isAskedFeedback = (value: AnyFeedbackWithId, userEmail: string): value is AskedFeedbackWithId =>
  value.status === 'asked' && value.receiverEmail === userEmail;

export const isWaitingForSendFeedback = (value: AnyFeedbackWithId, userEmail: string): value is AskedFeedbackWithId =>
  value.status === 'asked' && value.senderEmail === userEmail;

export const mapToTypedFeedbacks = (feedbacks: AnyFeedbackWithId[], userEmail: string): TypedFeedbacks =>
  feedbacks.reduce(
    (list, feedback) => {
      if (isReceivedFeedback(feedback, userEmail)) {
        list.received.push(feedback);
      } else if (isSentFeedback(feedback, userEmail)) {
        list.sent.push(feedback);
      } else if (isAskedFeedback(feedback, userEmail)) {
        list.asked.push(feedback);
      } else if (isWaitingForSendFeedback(feedback, userEmail)) {
        list.waitingForSend.push(feedback);
      }
      return list;
    },
    {
      received: [],
      sent: [],
      asked: [],
      waitingForSend: [],
    } as TypedFeedbacks,
  );
