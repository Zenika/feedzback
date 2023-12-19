export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];
