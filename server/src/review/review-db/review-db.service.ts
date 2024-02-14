import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './review-db.config';
import { SetReviewParams } from './review-db.params';
import { ReviewCollection } from './review-db.types';

@Injectable()
export class ReviewDbService {
  constructor(private firebaseService: FirebaseService) {}

  private get reviewCollection() {
    return this.firebaseService.db.collection(Collection.review);
  }

  async setReview({ reviewerEmail, note, comment = null }: SetReviewParams) {
    const initalData = { averageNote: 0, numberNote: 0, reviews: [] };
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
}
