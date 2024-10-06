import { FeedbackHistory, FeedbackHistoryStats, FeedbackMonthHistoryStats } from './feedback-stats.types';

export const buildHistoryStats = (history: FeedbackHistory[]): FeedbackHistoryStats => {
  // List of unique users who have given at least 1 feedback
  const giverEmailList = new Set<string>();

  // List of unique users who have received at least 1 feedback (including users with pending feedback requests)
  const receiverEmailList = new Set<string>();

  // List of unique users who have given, received or requested at least 1 feedback
  const allEmailList = new Set<string>();

  let spontaneousFeedback = 0;
  let requestedFeedbackDone = 0;
  let requestedFeedbackPending = 0;
  let sharedFeedback = 0;

  history.forEach(({ giverEmail, receiverEmail, requested, status, shared }) => {
    // For feedback requests, the `giverEmail` is not to be taken into account until he has replied.
    if (!requested || status === 'done') {
      giverEmailList.add(giverEmail);
      allEmailList.add(giverEmail);
    }

    receiverEmailList.add(receiverEmail);
    allEmailList.add(receiverEmail);

    if (!requested) {
      spontaneousFeedback += 1;
    } else if (status === 'done') {
      requestedFeedbackDone += 1;
    } else {
      requestedFeedbackPending += 1;
    }

    if (shared) {
      sharedFeedback += 1;
    }
  });

  return {
    uniqueGivers: giverEmailList.size,
    uniqueReceivers: receiverEmailList.size,
    uniqueUsers: allEmailList.size,

    spontaneousFeedback,
    requestedFeedbackDone,
    requestedFeedbackPending,
    sharedFeedback,
  };
};

// timestamp                    -> 1728166612791
// toLocaleDateString('fr-FR')  -> '06/10/2024'
// split/reverse/slice/join     -> '2024-10'
const toYYYMM = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('fr-FR').split('/').reverse().slice(0, 2).join('-');

export const buildHistoryByMonth = (history: FeedbackHistory[]): Record<string, FeedbackHistory[]> =>
  history.reduce(
    (historyByMonth, event) => {
      const month = toYYYMM(!event.requested || event.status === 'done' ? event.updatedAt : event.createdAt);

      historyByMonth[month] ??= [];
      historyByMonth[month].push(event);

      return historyByMonth;
    },
    {} as Record<string, FeedbackHistory[]>,
  );

export const buildHistoryByMonthStats = (
  historyByMonth: Record<string, FeedbackHistory[]>,
): FeedbackMonthHistoryStats[] =>
  Object.entries(historyByMonth)
    .map(([month, history]) => ({ month, ...buildHistoryStats(history) }))
    .sort(({ month: a }, { month: b }) => (a < b ? -1 : a > b ? 1 : 0));
