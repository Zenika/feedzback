import { FeedbackMonthHistoryStats } from './stats.types';

export const pluckMonthHistoryStats = (data: FeedbackMonthHistoryStats[]) => ({
  month: data.map(({ month }) => month),

  // User stats
  uniqueGivers: data.map(({ uniqueGivers }) => uniqueGivers),
  uniqueReceivers: data.map(({ uniqueReceivers }) => uniqueReceivers),
  uniqueGiversOrReceivers: data.map(({ uniqueGiversOrReceivers }) => uniqueGiversOrReceivers),
  uniqueRequesters: data.map(({ uniqueRequesters }) => uniqueRequesters),
  uniqueUsers: data.map(({ uniqueUsers }) => uniqueUsers),

  // Feedback stats
  spontaneousFeedback: data.map(({ spontaneousFeedback }) => spontaneousFeedback),
  requestedFeedbackDone: data.map(({ requestedFeedbackDone }) => requestedFeedbackDone),
  requestedFeedbackPending: data.map(({ requestedFeedbackPending }) => requestedFeedbackPending),
  sharedFeedback: data.map(({ sharedFeedback }) => sharedFeedback),
});
