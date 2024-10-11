export type FeedbackHistory = {
  giverEmail: string;
  receiverEmail: string;
  shared: boolean;
  requested: boolean;
  status: 'pending' | 'done';
  createdAt: number;
  updatedAt: number;
};

export type FeedbackStats = {
  // User stats
  uniqueGivers: number;
  uniqueReceivers: number;
  uniqueGiversOrReceivers: number;
  uniqueRequesters: number;
  uniqueUsers: number;

  // Feedback stats
  spontaneousFeedback: number;
  requestedFeedbackDone: number;
  requestedFeedbackPending: number;
  sharedFeedback: number;
};

export type FeedbackMonthStats = { month: string } & FeedbackStats;
