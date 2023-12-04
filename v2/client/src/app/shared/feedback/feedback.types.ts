export type Feedback = {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  message: string;
  shared: boolean;
  status: 'given';
  createdAt: number;
  updatedAt: number;
};

export type AskedFeedback = {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: 'asked';
  createdAt: number;
};

export type FeedbackIdObj = Pick<Feedback, 'id'>;

export type TypedFeedbacks = {
  sent: Feedback[];
  received: Feedback[];
  asked: AskedFeedback[];
  waitingForSend: AskedFeedback[];
};
