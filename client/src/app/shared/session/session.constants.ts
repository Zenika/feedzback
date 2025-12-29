import { SessionConfig } from './session.types';

export const SESSION_CONFIG: SessionConfig = {
  idle: 3_600, // seconds -> 1 hour
  idleWarning: 600, // seconds -> 10 minutes
};

export const SESSION_ACTIVITY_DATE_STORAGE_KEY = 'session.activityDate';
