export const authStub = {
  constructor: () => jest.fn(),
  oAuthProvider: () => jest.fn(),
  signInWithGoogle: () => jest.fn(),
  getUserDetails: () => jest.fn(),
  isAnonymous: () => jest.fn(),
  signOut: () => jest.fn(),
  getUserTokenId: () => jest.fn(),
};
