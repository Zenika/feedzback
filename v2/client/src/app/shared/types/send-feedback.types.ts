export type SendFeedback = {
  token: string;
  senderEmail: string;
  receverEmail: string; // !FIXME: rename `receiverEmail`
  positiveFeedback: string;
  toImprove: string;
  comment: string;
};
