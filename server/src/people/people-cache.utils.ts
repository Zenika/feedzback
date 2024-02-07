import { Person } from '../core/google-apis';
import { SearchablePerson } from './people-cache.types';

const consolidateSearchTokens = (rawSearchTokens: string[]): string[] =>
  rawSearchTokens
    .reduce((searchTokens, searchToken) => {
      if (!searchTokens.includes(searchToken)) {
        searchTokens.push(searchToken);
      }
      return searchTokens;
    }, [] as string[])
    .sort((a, b) => (a.length < b.length ? -1 : a.length > b.length ? 1 : 0));

const buildSearchTokens = (value?: string): string[] =>
  (value ?? '')
    .toLowerCase()
    .split(/\.|-|_|\s+/g)
    .filter((searchToken) => searchToken !== '');

const buildEmailSearchTokens = (email: string): string[] => {
  const emailLowerCase = email.trim().toLowerCase();
  const [username] = emailLowerCase.split('@');
  return [emailLowerCase, ...buildSearchTokens(username)];
};

export const mapToSearchablePerson = (person: Person): SearchablePerson => {
  const searchTokens = consolidateSearchTokens([
    ...buildEmailSearchTokens(person.email),
    ...buildSearchTokens(person.displayName),
  ]);
  return { ...person, searchTokens };
};

export const searchPersons = (query: string, searchablePersons: SearchablePerson[]): Person[] => {
  const querySearchTokens = buildSearchTokens(query);

  return searchablePersons
    .filter(({ searchTokens }) =>
      querySearchTokens.every((querySearchToken) =>
        searchTokens.some((searchToken) => searchToken.startsWith(querySearchToken)),
      ),
    )
    .map(({ email, displayName, photoUrl }) => ({ email, displayName, photoUrl }));
};
