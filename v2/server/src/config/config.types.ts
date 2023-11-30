import { ServiceAccount } from 'firebase-admin/app';

export type AppConfig = {
  firebaseServiceAccount: Required<ServiceAccount>;
};
