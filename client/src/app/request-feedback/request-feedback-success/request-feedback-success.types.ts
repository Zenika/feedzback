export type RequestFeedbackSuccess =
  | { method: 'send'; recipients: string[] }
  | { method: 'generate'; magicLink: string };
