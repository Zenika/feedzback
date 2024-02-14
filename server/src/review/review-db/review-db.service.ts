import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './review-db.config';
import { SetReviewParams } from './review-db.params';
import { Review, ReviewCollection, ReviewStats } from './review-db.types';

@Injectable()
export class ReviewDbService {
  constructor(private firebaseService: FirebaseService) {}

  private get reviewCollection() {
    return this.firebaseService.db.collection(Collection.review);
  }

  async setReview({ reviewerEmail, note, comment = null }: SetReviewParams) {
    const initalData = { reviews: [] };
    const reviewerEmailDocumentRef = this.reviewCollection.doc(reviewerEmail);
    const reviewerEmailDocument = await reviewerEmailDocumentRef.get();

    const oldData = reviewerEmailDocument.data() ?? initalData;

    const oldReviews = oldData.reviews;

    const data: ReviewCollection = {
      reviews: [{ note, comment, updatedAt: Date.now() }],
    };

    /**
     * We handle a unique review
     */
    if (oldReviews.length > 0) {
      await reviewerEmailDocumentRef.update(data);
    } else {
      await reviewerEmailDocumentRef.create(data);
    }

    return true;
  }

  async getStats() {
    const snapshot = await this.reviewCollection.get();

    const splits = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

    snapshot.forEach((doc) => {
      (doc.data().reviews as Review[]).forEach((review) => (splits[review.note] = splits[review.note] + 1));
    });

    const { nb, tt } = Object.entries(splits).reduce(
      (acc, [key, value]) => ({
        nb: acc.nb + value,
        tt: acc.tt + Number(key) * value,
      }),
      { nb: 0, tt: 0 },
    );
    const stats: ReviewStats = { average: nb ? tt / nb : 0, splits };

    return stats;
  }
}
