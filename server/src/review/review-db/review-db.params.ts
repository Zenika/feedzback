import { ReviewNote } from './review-db.types';

export type PostReviewParams = {
  reviewerEmail: string;
  note: ReviewNote;
  comment: string;
};
