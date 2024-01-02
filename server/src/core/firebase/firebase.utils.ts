import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const docWithId = <T>(doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }) as T;

export const docsWithId = <T>(docs: QueryDocumentSnapshot[]) => docs.map(docWithId<T>);

export const sortList = <T>(items: T[], key: keyof T, order: 'asc' | 'desc' = 'asc') => {
  const sortedItems = [...items];
  const result = order === 'asc' ? 1 : -1;
  sortedItems.sort((itemA, itemB) => (itemA[key] < itemB[key] ? -result : itemA[key] > itemB[key] ? result : 0));
  return sortedItems;
};
