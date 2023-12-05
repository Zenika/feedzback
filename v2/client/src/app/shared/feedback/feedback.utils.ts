import { FeedbackType } from './feedback.types';

export const getFeedbackType = (value: string | null | undefined): FeedbackType | undefined => {
  const _value = value?.toLowerCase();
  if (_value === FeedbackType.received || _value === FeedbackType.sent) {
    return _value;
  }
  return undefined;
};
