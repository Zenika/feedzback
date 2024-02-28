import { User } from 'firebase/auth';
import { UserState } from './auth.types';

export const buildUserState = (user: User | null | undefined) =>
  ({
    guest: user === null,
    anonymous: user?.isAnonymous === true,
    authenticated: user?.isAnonymous === false,
  }) satisfies UserState;
