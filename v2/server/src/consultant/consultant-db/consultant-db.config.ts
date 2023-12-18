export const Collection = {
  consultant: 'consultant',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];
