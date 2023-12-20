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
