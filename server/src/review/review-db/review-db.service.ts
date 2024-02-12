import { Injectable } from '@nestjs/common';
import { CryptoService } from '../../core/crypto/crypto.service';
import { FirebaseService } from '../../core/firebase';
import { Collection, ReviewDatesCollection } from './review-db.config';
import { SetReviewParams } from './review-db.params';
import { Review, ReviewEncryptedFields, reviewEncryptedFields } from './review-db.types';

@Injectable()
export class ReviewDbService {
  constructor(
    private firebaseService: FirebaseService,
    private cryptoService: CryptoService,
  ) {}

  private get reviewCollection() {
    return this.firebaseService.db.collection(Collection.review);
  }

  async setReview({ reviewerEmail, note, comment = null }: SetReviewParams) {
    const data: Review = { note, comment, updatedAt: Date.now() };
    const encryptedData = this.encryptReview<Review>(data);

    const reviewDatesCollection = this.reviewCollection.doc(reviewerEmail).collection(ReviewDatesCollection);

    const existingReviewes = await reviewDatesCollection.orderBy('updatedAt', 'desc').get();

    /**
     * We handle a unique review
     */
    if (existingReviewes.docs.length > 0) {
      const lastReview = existingReviewes.docs.length > 0 && existingReviewes.docs[0];
      lastReview && (await lastReview.ref.update(encryptedData));
    } else {
      await reviewDatesCollection.add(encryptedData);
    }

    return true;
  }

  // ----- Encrypt and decrypt feedback -----

  private encryptReview<T extends Partial<Review>>(data: T): T {
    return this.runEncryption('encrypt', data);
  }

  private decryptReview<T extends Partial<Review>>(data: T): T {
    return this.runEncryption('decrypt', data);
  }

  private runEncryption<T extends Partial<ReviewEncryptedFields>>(operation: 'encrypt' | 'decrypt', input: T): T {
    const output: T = { ...input };
    reviewEncryptedFields.forEach((field) => {
      if (!output[field]) {
        return;
      }
      output[field] = this.cryptoService[operation](output[field]!);
    });
    return output;
  }
}
