import { FeedbackDetailsPlucked, FeedbackMonthStats, FormattedMonth } from './stats.types';

export const pluckFeedbackMonthStats = (data: FeedbackMonthStats[]): FeedbackDetailsPlucked => ({
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

export const formatMonth = (yyyymm: string): FormattedMonth => {
  const [yyyy, mm] = yyyymm.split('-');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(mm) - 1];
  return {
    long: `${month} ${yyyy}`, // "Jan 2024"
    short: `${mm} ${yyyy.substring(2)}`, // "01 24"
  };
};
