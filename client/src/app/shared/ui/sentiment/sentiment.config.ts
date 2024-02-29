import { SentimentConfig } from './sentiment.types';

export const SENTIMENTS_ASC: SentimentConfig[] = [
  {
    note: 1,
    icon: 'sentiment_dissatisfied',
    text: $localize`:@@Component.Sentiment.Note1:pas satisfait`,
  },
  {
    note: 3,
    icon: 'sentiment_neutral',
    text: $localize`:@@Component.Sentiment.Note3:neutre`,
  },
  {
    note: 5,
    icon: 'sentiment_satisfied',
    text: $localize`:@@Component.Sentiment.Note5:satisfait`,
  },
] as const;

export const SENTIMENTS_DESC = [...SENTIMENTS_ASC].reverse();
