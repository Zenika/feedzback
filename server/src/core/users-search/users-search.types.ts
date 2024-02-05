import { User } from 'src/people/people.types';

export interface UserSearch {
  search: (query: string, pakeToken?: string) => Promise<{ items: User[]; nextPageToken?: string }>;
}
