import { Injectable } from '@nestjs/common';
import { FeedbackDbService } from '../feedback-db/feedback-db.service';

type FeedbackHistory = {
  createdAt: number;
  updatedAt: number;
  requested: boolean;
  shared: boolean;
  status: 'pending' | 'done';
};

@Injectable()
export class FeedbackStatsService {
  /**
   * List of unique users who have given at least 1 feedback
   */
  private giverEmailList = new Set<string>();

  /**
   * List of unique users who have received at least 1 feedback
   */
  private receiverEmailList = new Set<string>();

  /**
   * List of unique users who have given of received at least 1 feedback
   */
  private allEmailList = new Set<string>();

  private history = new Map<string, FeedbackHistory>();

  constructor(private feedbackDbService: FeedbackDbService) {
    this.feedbackDbService.onFeedbackChanges((feedbacks) => {
      feedbacks.forEach(({ giverEmail, receiverEmail, requested, status }) => {
        // For feedback requests, the `giverEmail` is not to be taken into account until he has replied.
        if (!requested || status === 'done') {
          this.giverEmailList.add(giverEmail);
          this.allEmailList.add(giverEmail);
        }

        this.receiverEmailList.add(receiverEmail);
        this.allEmailList.add(receiverEmail);
      });

      feedbacks.forEach(({ id, createdAt, updatedAt, requested, shared, status }) =>
        this.history.set(id, { createdAt, updatedAt, requested, shared, status }),
      );
    });
  }

  // Note that the first call to this method will trigger service creation and data supply.
  // As the method's return is synchronous, it's possible that there will be no data for the first few calls.
  getStats() {
    return {
      numberOfUniqueGivers: this.giverEmailList.size,
      numberOfUniqueReceivers: this.receiverEmailList.size,
      numberOfUniqueUsers: this.allEmailList.size,
      history: Array.from(this.history.values()),
    };
  }
}
