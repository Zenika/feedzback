import { User } from 'firebase/auth';
import { UserStatus } from './auth.types';

export const buildUserStatus = (user: User | null | undefined) =>
  ({
    guest: user === null,
    anonymous: user?.isAnonymous === true,
    authenticated: user?.isAnonymous === false,
    status: user === null ? 'guest' : user?.isAnonymous === true ? 'anonymous' : 'authenticated',
  }) satisfies UserStatus;
