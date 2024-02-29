export type Review = {
  note: ReviewNote;
  comment: string;
  updatedAt: number;
};

export type ReviewNote = 1 | 3 | 5;

export type AllReviewStats = {
  numberOfReviews: number;
  averageOutOfFive: number;
  percentagePerNote: PercentagePerNote;
};

export type PercentagePerNote = Record<ReviewNote, number>;
