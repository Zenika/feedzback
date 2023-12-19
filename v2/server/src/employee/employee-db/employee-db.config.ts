export const Collection = {
  employee: 'employee',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];
