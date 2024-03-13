import { Injectable } from '@nestjs/common';
import { FeedbackWithId } from '../feedback-db';
import { FeedbackDbService } from '../feedback-db/feedback-db.service';

@Injectable()
export class FeedbackStatsService {
  private giverEmailList = new Set<string>();

  private receiverEmailList = new Set<string>();

  private allEmailList = new Set<string>();

  private history: Pick<FeedbackWithId, 'updatedAt' | 'requested'>[] = [];

  constructor(private feedbackDbService: FeedbackDbService) {
    this.feedbackDbService.onFeedbackChanges((feedbacks) => {
      feedbacks.forEach(({ giverEmail, receiverEmail }) => {
        this.giverEmailList.add(giverEmail);
        this.receiverEmailList.add(receiverEmail);

        this.allEmailList.add(giverEmail);
        this.allEmailList.add(receiverEmail);
      });

      this.history.push(
        ...feedbacks.map(({ createdAt, updatedAt, requested, status }) => ({
          createdAt,
          updatedAt,
          requested,
          status,
        })),
      );
    });
  }

  getStats() {
    return {
      giverCount: this.giverEmailList.size,
      receiverCount: this.receiverEmailList.size,
      allCount: this.allEmailList.size,
      history: this.history,
    };
  }
}
