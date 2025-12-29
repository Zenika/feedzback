export type SessionConfig = {
  /**
   * Idle time (in seconds) after which the user is automatically logged out.
   */
  idle: number;

  /**
   * Delay (in seconds) before automatic logout for displaying a warning message.
   */
  idleWarning: number;
};

export type SessionIdleEvent = 'idleWarning' | 'noIdleWarning' | 'idle';
