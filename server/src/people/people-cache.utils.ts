import { Person } from '../core/google-apis';
import { SearchablePerson } from './people-cache.types';

const consolidateSearchTokens = (rawSearchTokens: string[]): string[] =>
  rawSearchTokens
    // Remove duplicate tokens
    .reduce((searchTokens, searchToken) => {
      if (!searchTokens.includes(searchToken)) {
        searchTokens.push(searchToken);
      }
      return searchTokens;
    }, [] as string[])
    // Sort tokens by length
    .sort((a, b) => (a.length < b.length ? -1 : a.length > b.length ? 1 : 0));

const buildSearchTokens = (value?: string): string[] =>
  (value ?? '')
    .toLowerCase()
    .split(/\s+/g)
    .map((searchToken) => {
      if (searchToken.includes('@')) {
        const [username] = searchToken.split('@');
        return [searchToken, ...username.split(/\.|-|_/g)];
      }
      return searchToken.split(/\.|-|_/g);
    })
    .flat()
    .filter((searchToken) => searchToken !== '');

export const mapToSearchablePerson = (person: Person): SearchablePerson => {
  const searchTokens = consolidateSearchTokens([
    ...buildSearchTokens(person.email),
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
    .map((searchablePerson) => {
      const { searchTokens, ...person } = searchablePerson; // eslint-disable-line @typescript-eslint/no-unused-vars
      return person;
    });
};
