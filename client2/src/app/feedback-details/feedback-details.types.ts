export const FeedbackType = {
  sent: 'sent',
  received: 'received',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];
