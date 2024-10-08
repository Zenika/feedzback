import { Injectable } from '@nestjs/common';
import { FeedbackDbService } from '../feedback-db/feedback-db.service';
import { FeedbackHistory } from './feedback-stats.types';
import { buildHistoryByMonth, buildHistoryByMonthStats, buildHistoryStats } from './feedback-stats.utils';

@Injectable()
export class FeedbackStatsService {
  private history = new Map<string, FeedbackHistory>();

  constructor(private feedbackDbService: FeedbackDbService) {
    this.feedbackDbService.onFeedbackChanges((feedbacks) => {
      feedbacks.forEach(({ id, giverEmail, receiverEmail, shared, requested, status, createdAt, updatedAt }) =>
        this.history.set(id, { giverEmail, receiverEmail, shared, requested, status, createdAt, updatedAt }),
      );
    });
  }

  // Note that the first call to this method will trigger service creation and data supply.
  // As the method's return is synchronous, it's possible that there will be no data for the first few calls.
  getStats() {
    const history = Array.from(this.history.values());

    return {
      summary: buildHistoryStats(history),
      details: buildHistoryByMonthStats(buildHistoryByMonth(history)),
      history: history.map(({ createdAt, updatedAt, requested, status, shared }) => ({
        createdAt,
        updatedAt,
        requested,
        status,
        shared,
      })),
    };
  }
}
