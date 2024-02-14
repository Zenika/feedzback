import { Review } from './review-db.types';

export type ReviewParams = Pick<Review, 'note' | 'comment'>;

export type SetReviewParams = { reviewerEmail: string } & ReviewParams;
