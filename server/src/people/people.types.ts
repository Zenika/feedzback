export type Person = {
  email: string;
  displayName?: string;
  photoUrl?: string;
};

export interface PersonWithSearchTokens extends Person {
  searchTokens: string[];
}
