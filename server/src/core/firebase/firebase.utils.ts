import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const docWithId = <T>(doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }) as T;

export const docsWithId = <T>(docs: QueryDocumentSnapshot[]) => docs.map(docWithId<T>);
