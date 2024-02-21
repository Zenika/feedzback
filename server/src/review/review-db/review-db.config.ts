export const Collection = {
  review: 'appReview',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];
