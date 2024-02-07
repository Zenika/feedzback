import { Person } from '../core/google-apis';

export type SearchablePerson = Person & {
  searchTokens: string[];
};
