import { PercentagePerNote } from './review-db.types';

export const buildEmptyPercentagePerNote = () =>
  ({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }) satisfies PercentagePerNote;
