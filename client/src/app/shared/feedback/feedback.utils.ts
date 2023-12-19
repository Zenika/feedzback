import { FeedbackType } from './feedback.types';

export const getFeedbackType = (value: string | null | undefined): FeedbackType | undefined =>
  Object.values(FeedbackType).find((feedbackType) => value?.toLowerCase() === feedbackType.toLowerCase());
