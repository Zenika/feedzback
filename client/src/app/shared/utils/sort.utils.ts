export const sortList = <T>(items: T[], key: keyof T, order: 'asc' | 'desc' = 'asc') => {
  const sortedItems = [...items];
  const result = order === 'asc' ? 1 : -1;
  sortedItems.sort((itemA, itemB) => (itemA[key] < itemB[key] ? -result : itemA[key] > itemB[key] ? result : 0));
  return sortedItems;
};
