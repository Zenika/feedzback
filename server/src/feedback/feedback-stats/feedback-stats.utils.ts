import { FeedbackHistory, FeedbackMonthStats, FeedbackStats } from './feedback-stats.types';

export const buildFeedbackStats = (history: FeedbackHistory[]): FeedbackStats => {
  // List of unique users who have given at least 1 feedback (spontaneous or requested).
  const giverEmailList = new Set<string>();

  // List of unique users who have received at least 1 feedback (spontaneous or requested).
  const receiverEmailList = new Set<string>();

  // List of unique users who have given or received at least 1 feedback (spontaneous or requested).
  const giverOrReceiverEmailList = new Set<string>();

  // List of unique users who have requested at least 1 feedback but have not yet received a reply (pending request only).
  const requesterEmailList = new Set<string>();

  // List of unique users who have given, received or requested at least 1 feedback.
  const allEmailList = new Set<string>();

  let spontaneousFeedback = 0;
  let requestedFeedbackDone = 0;
  let requestedFeedbackPending = 0;
  let sharedFeedback = 0;

  history.forEach(({ giverEmail, receiverEmail, requested, status, shared }) => {
    if (requested && status === 'pending') {
      requesterEmailList.add(receiverEmail);
      allEmailList.add(receiverEmail);
    } else {
      receiverEmailList.add(receiverEmail);
      giverOrReceiverEmailList.add(receiverEmail);
      allEmailList.add(receiverEmail);

      giverEmailList.add(giverEmail);
      giverOrReceiverEmailList.add(giverEmail);
      allEmailList.add(giverEmail);
    }

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
    uniqueGiversOrReceivers: giverOrReceiverEmailList.size,
    uniqueRequesters: requesterEmailList.size,
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

export const buildFeedbackMonthStats = (historyByMonth: Record<string, FeedbackHistory[]>): FeedbackMonthStats[] =>
  Object.entries(historyByMonth)
    .map(([month, history]) => ({ month, ...buildFeedbackStats(history) }))
    .sort(({ month: a }, { month: b }) => (a < b ? -1 : a > b ? 1 : 0));
