import { FEEDBACK_REQUEST_DEADLINE_IN_DAYS } from './feedback-db.config';
import { FeedbackArchived, FeedbackItemWithId, FeedbackRequestItemWithId, FeedbackStatus } from './feedback-db.types';

/**
 * A feedback request less than `FEEDBACK_REQUEST_DEADLINE_IN_DAYS` days old is considered recent.
 */
export const isRecentFeedbackRequest = (updatedAt: number) => {
  const DAY_IN_MS = 86_400_000;
  return (Date.now() - updatedAt) / DAY_IN_MS < FEEDBACK_REQUEST_DEADLINE_IN_DAYS;
};

export const NOT_ARCHIVED_FOR_RECEIVER = [FeedbackArchived.No, FeedbackArchived.Giver] as const;
export const NOT_ARCHIVED_FOR_GIVER = [FeedbackArchived.No, FeedbackArchived.Receiver] as const;

export const sortFeedbackItemsDesc = (
  items: (FeedbackItemWithId | FeedbackRequestItemWithId)[],
): (FeedbackItemWithId | FeedbackRequestItemWithId)[] =>
  items.sort((a, b) => {
    const dateA = a.status === FeedbackStatus ? a.updatedAt : a.createdAt;
    const dateB = b.status === FeedbackStatus ? b.updatedAt : b.createdAt;
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  });

export const sumFeedbackArchived = (current: FeedbackArchived, extra: FeedbackArchived): FeedbackArchived | null => {
  if (current === FeedbackArchived.No) {
    return extra;
  }
  if (current + extra === FeedbackArchived.Both) {
    return FeedbackArchived.Both;
  }
  return null;
};
