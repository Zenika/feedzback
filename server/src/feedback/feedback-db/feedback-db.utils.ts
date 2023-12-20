import { FeedbackRequestSummaryWithId, FeedbackSummaryWithId, TypedFeedbackSummaries } from './feedback-db.types';

type AnyFeedbackSummaryWithId = FeedbackSummaryWithId | FeedbackRequestSummaryWithId;

export const isReceivedFeedbackSummary = (
  value: AnyFeedbackSummaryWithId,
  viewerEmail: string,
): value is FeedbackSummaryWithId => value.status === 'done' && value.receiverEmail === viewerEmail;

export const isGivenFeedbackSummary = (
  value: AnyFeedbackSummaryWithId,
  viewerEmail: string,
): value is FeedbackSummaryWithId => value.status === 'done' && value.senderEmail === viewerEmail;

export const isSentFeedbackRequestSummary = (
  value: AnyFeedbackSummaryWithId,
  viewerEmail: string,
): value is FeedbackRequestSummaryWithId => value.status === 'pending' && value.receiverEmail === viewerEmail;

export const isReceivedFeedbackRequestSummary = (
  value: AnyFeedbackSummaryWithId,
  viewerEmail: string,
): value is FeedbackRequestSummaryWithId => value.status === 'pending' && value.senderEmail === viewerEmail;

export const mapToTypedFeedbackSummaries = (
  feedbacks: AnyFeedbackSummaryWithId[],
  viewerEmail: string,
): TypedFeedbackSummaries =>
  feedbacks.reduce(
    (list, feedback) => {
      if (isReceivedFeedbackSummary(feedback, viewerEmail)) list.received.push(feedback);
      else if (isGivenFeedbackSummary(feedback, viewerEmail)) list.given.push(feedback);
      else if (isSentFeedbackRequestSummary(feedback, viewerEmail)) list.sentRequest.push(feedback);
      else if (isReceivedFeedbackRequestSummary(feedback, viewerEmail)) list.receivedRequest.push(feedback);
      return list;
    },
    {
      received: [],
      given: [],
      sentRequest: [],
      receivedRequest: [],
    } satisfies TypedFeedbackSummaries as TypedFeedbackSummaries,
  );
