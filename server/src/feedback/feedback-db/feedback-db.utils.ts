import { FEEDBACK_REQUEST_DEADLINE_IN_DAYS } from './feedback-db.config';
import { FeedbackItemWithId, FeedbackListMap, FeedbackRequestItemWithId } from './feedback-db.types';

type Item = FeedbackItemWithId | FeedbackRequestItemWithId;

const isReceived = (item: Item, viewerEmail: string): item is FeedbackItemWithId =>
  item.status === 'done' && item.receiverEmail === viewerEmail;

const isGiven = (item: Item, viewerEmail: string): item is FeedbackItemWithId =>
  item.status === 'done' && item.giverEmail === viewerEmail;

const isSentRequest = (item: Item, viewerEmail: string): item is FeedbackRequestItemWithId =>
  item.status === 'pending' && item.receiverEmail === viewerEmail;

const isReceivedRequest = (item: Item, viewerEmail: string): item is FeedbackRequestItemWithId =>
  item.status === 'pending' && item.giverEmail === viewerEmail;

export const mapToFeedbackListMap = (items: Item[], viewerEmail: string): FeedbackListMap =>
  items.reduce(
    (list, feedback) => {
      if (isReceived(feedback, viewerEmail)) list.received.push(feedback);
      else if (isGiven(feedback, viewerEmail)) list.given.push(feedback);
      else if (isSentRequest(feedback, viewerEmail)) list.sentRequest.push(feedback);
      else if (isReceivedRequest(feedback, viewerEmail)) list.receivedRequest.push(feedback);
      return list;
    },
    {
      received: [],
      given: [],
      sentRequest: [],
      receivedRequest: [],
    } satisfies FeedbackListMap as FeedbackListMap,
  );

/**
 * A feedback request less than `FEEDBACK_REQUEST_DEADLINE_IN_DAYS` days old is considered recent.
 */
export const isRecentFeedbackRequest = (updatedAt: number) => {
  const DAY_IN_MS = 86_400_000;
  return (Date.now() - updatedAt) / DAY_IN_MS < FEEDBACK_REQUEST_DEADLINE_IN_DAYS;
};
