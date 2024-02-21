import { Injectable } from '@nestjs/common';
import { FieldValue } from 'firebase-admin/firestore';
import { FirebaseService } from '../../core/firebase';
import { Collection } from './review-db.config';
import { PostReviewParams } from './review-db.params';
import { AllReviewStats, Review, ReviewNote } from './review-db.types';
import { buildEmptyPercentagePerNote } from './review-db.utils';

@Injectable()
export class ReviewDbService {
  constructor(private firebaseService: FirebaseService) {}

  private get reviewCollection() {
    return this.firebaseService.db.collection(Collection.review);
  }

  async postReview({ reviewerEmail, note, comment }: PostReviewParams) {
    const review: Review = { note, comment, updatedAt: Date.now() };
    await this.reviewCollection.doc(reviewerEmail).set({ reviews: FieldValue.arrayUnion(review) }, { merge: true });
  }

  async getStats() {
    let numberOfReviews = 0;
    let score = 0;
    const scorePerNote = buildEmptyPercentagePerNote();

    const reviewQuery = await this.reviewCollection.get();
    reviewQuery.forEach((reviewDoc) => {
      const lastReview = (reviewDoc.data().reviews as Review[]).pop();
      if (!lastReview) {
        return;
      }
      numberOfReviews += 1;
      score += lastReview.note;
      scorePerNote[lastReview.note] += 1;
    });

    if (numberOfReviews === 0) {
      return {
        numberOfReviews,
        averageOutOfFive: 0,
        percentagePerNote: scorePerNote,
      } satisfies AllReviewStats;
    }

    const averageOutOfFive = Math.round((10 * score) / numberOfReviews) / 10;

    const percentagePerNote = buildEmptyPercentagePerNote();
    for (const key in scorePerNote) {
      const noteKey = key as unknown as ReviewNote;
      const noteValue = scorePerNote[noteKey];
      percentagePerNote[noteKey] = Math.round((1000 * noteValue) / numberOfReviews) / 10;
    }

    return {
      numberOfReviews,
      averageOutOfFive,
      percentagePerNote,
    } satisfies AllReviewStats;
  }
}
