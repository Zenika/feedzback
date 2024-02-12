export const Collection = {
  review: 'review',
} as const;

export const ReviewDatesCollection = 'ReviewDates';

export type Collection = (typeof Collection)[keyof typeof Collection];
