export type ReviewNote = 1 | 2 | 3 | 4 | 5;

export type Review = {
  note: ReviewNote;
  comment?: string | null;
  updatedAt: number;
};

// ----- ReviewEncryptedFields -----

export type ReviewEncryptedFields = Pick<Review, 'comment'>;

export const reviewEncryptedFields: (keyof ReviewEncryptedFields)[] = ['comment'] as const;
