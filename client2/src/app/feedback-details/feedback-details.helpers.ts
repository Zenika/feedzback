import { FeedbackType } from './feedback-details.types';

export const getFeedbackType = (value: string | null | undefined): FeedbackType | void => {
  const _value = value?.toLowerCase();
  if (_value === FeedbackType.received || _value === FeedbackType.sent) {
    return _value;
  }
};
