export type UserStatus = {
  guest: boolean;
  anonymous: boolean;
  authenticated: boolean;
  status: 'guest' | 'anonymous' | 'authenticated';
};

export type SignedIn = false | 'now' | 'previously';
