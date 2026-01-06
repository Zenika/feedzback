// The same config is available on client side:
//    `client/src/app/shared/feedback/feedback.config.ts`

export const SMALL_MAX_LENGTH = 500;
export const MEDIUM_MAX_LENGTH = 1000;
export const LARGE_MAX_LENGTH = 4000;

// Note: due to date imprecision, on the server side, the deadline is shorter than on the client side.
export const FEEDBACK_REQUEST_DEADLINE_IN_DAYS = 29; // (not `30` like on client-side)

// Note: due to date imprecision, on the server side, the deadline is longer than on the client side.
export const FEEDBACK_PRE_REQUEST_EXPIRATION_IN_DAYS = 4; // (not `3` like on client-side)
export const FEEDBACK_PRE_REQUEST_MAX_USES = 20;
