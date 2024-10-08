export type FeedbackHistoryStats = {
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

export type FeedbackMonthHistoryStats = { month: string } & FeedbackHistoryStats;

export type FeedbackStats = {
  summary: FeedbackHistoryStats;
  details: FeedbackMonthHistoryStats[];
};
