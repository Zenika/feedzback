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

export type FeedbackStatsData = {
  summary: FeedbackStats;
  details: FeedbackMonthStats[];
};

// Map the array of objects (`FeedbackMonthHistoryStats[]`) to an object of arrays to feed echarts.
export type FeedbackDetailsPlucked = {
  month: string[];

  // User stats
  uniqueGivers: number[];
  uniqueReceivers: number[];
  uniqueGiversOrReceivers: number[];
  uniqueRequesters: number[];
  uniqueUsers: number[];

  // Feedback stats
  spontaneousFeedback: number[];
  requestedFeedbackDone: number[];
  requestedFeedbackPending: number[];
  sharedFeedback: number[];
};

export type FeedbackPeriod = {
  start: string;
  end: string;
};

export type FormattedMonth = {
  short: string;
  long: string;
};
