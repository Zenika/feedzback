export const parseNumber = (value: string | null | undefined): number | undefined => {
  if (!value?.trim()) {
    return undefined;
  }
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};
