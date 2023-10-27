export interface Feedback {
  id: string;
  token: string;
  senderName: string;
  senderEmail: string;
  receverEmail: string; // !FIXME: rename `receiverEmail`
  receverName: string; // !FIXME: rename `receiverName`
  positiveFeedback: string;
  toImprove: string;
  comment: string;
  createdAt: string;
}
