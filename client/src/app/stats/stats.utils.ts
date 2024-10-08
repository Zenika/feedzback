import { FeedbackStats } from './stats.types';

export const pluckStatsDetails = ({ details }: FeedbackStats) => ({
  month: details.map(({ month }) => month),

  // User stats
  uniqueGivers: details.map(({ uniqueGivers }) => uniqueGivers),
  uniqueReceivers: details.map(({ uniqueReceivers }) => uniqueReceivers),
  uniqueGiversOrReceivers: details.map(({ uniqueGiversOrReceivers }) => uniqueGiversOrReceivers),
  uniqueRequesters: details.map(({ uniqueRequesters }) => uniqueRequesters),
  uniqueUsers: details.map(({ uniqueUsers }) => uniqueUsers),

  // Feedback stats
  spontaneousFeedback: details.map(({ spontaneousFeedback }) => spontaneousFeedback),
  requestedFeedbackDone: details.map(({ requestedFeedbackDone }) => requestedFeedbackDone),
  requestedFeedbackPending: details.map(({ requestedFeedbackPending }) => requestedFeedbackPending),
  sharedFeedback: details.map(({ sharedFeedback }) => sharedFeedback),
});
