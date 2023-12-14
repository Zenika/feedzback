export type EmailTemplate = {
  subject: string;
  html: string;
};

export type EmailBuilders = {
  buildRequestFeedback(receiverEmail: string, message: string, tokenId: string): EmailTemplate;
};
