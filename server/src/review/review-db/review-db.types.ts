export type ReviewNote = 1 | 2 | 3 | 4 | 5;

export type Review = {
  note: ReviewNote;
  comment?: string | null;
  updatedAt: number;
};

export type ReviewCollection = {
  reviews: Review[];
};
export type ReviewStats = {
  splits: Record<ReviewNote, number>;
  average: number;
};
