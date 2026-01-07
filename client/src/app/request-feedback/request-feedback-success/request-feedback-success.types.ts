export type RequestFeedbackSuccess =
  | { method: 'send'; recipients: string[] }
  | { method: 'generate'; linkToShare: string };
