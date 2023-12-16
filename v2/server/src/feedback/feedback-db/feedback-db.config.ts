export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
  manager: 'manager',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];
