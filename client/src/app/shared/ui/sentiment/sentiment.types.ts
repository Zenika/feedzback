export type SentimentNote = 0 | 1 | 2 | 3 | 4 | 5;

export type SentimentConfig = {
  note: Exclude<SentimentNote, 0>;
  icon: string;
  text: string;
};
