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

    // Note:
    // For the moment, we don't store review history. So each review overwrites the previous one.
    // To enable review history, simply set `{ merge: true }`.
    await this.reviewCollection.doc(reviewerEmail).set({ reviews: FieldValue.arrayUnion(review) }, { merge: false });
  }

  async getLastReview(reviewerEmail: string) {
    const reviewDoc = await this.reviewCollection.doc(reviewerEmail).get();
    if (!reviewDoc.exists) {
      return;
    }
    const lastReview = ((reviewDoc.data()?.reviews ?? []) as Review[]).pop();
    if (!lastReview) {
      return;
    }
    return lastReview;
  }

  async getStats() {
    let numberOfReviews = 0;
    let score = 0;
    const scorePerNote = buildEmptyPercentagePerNote();

    const reviewQuery = await this.reviewCollection.get();
    reviewQuery.forEach((reviewDoc) => {
      const lastReview = ((reviewDoc.data().reviews ?? []) as Review[]).pop();
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
    Object.entries(scorePerNote).forEach(([noteKey, noteValue]) => {
      percentagePerNote[noteKey as unknown as ReviewNote] = Math.round((1000 * noteValue) / numberOfReviews) / 10;
    });

    return {
      numberOfReviews,
      averageOutOfFive,
      percentagePerNote,
    } satisfies AllReviewStats;
  }
}
