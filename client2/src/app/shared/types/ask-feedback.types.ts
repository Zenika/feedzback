export type AskFeedback = {
  token: string;
  name: string;
  email: string; // This is indeed the sender email...
  senderEmail: string; // !FIXME: it's more the receiver email
  text: string;
};
