import { SentimentConfig } from './sentiment.types';

export const SENTIMENTS_ASC: SentimentConfig[] = [
  {
    note: 1,
    icon: 'sentiment_very_dissatisfied',
    text: $localize`:@@Component.Sentiment.Note1:pas du tout satisfait`,
  },
  {
    note: 2,
    icon: 'sentiment_dissatisfied',
    text: $localize`:@@Component.Sentiment.Note2:pas satisfait`,
  },
  {
    note: 3,
    icon: 'sentiment_neutral',
    text: $localize`:@@Component.Sentiment.Note3:neutre`,
  },
  {
    note: 4,
    icon: 'sentiment_satisfied',
    text: $localize`:@@Component.Sentiment.Note4:satisfait`,
  },
  {
    note: 5,
    icon: 'sentiment_very_satisfied',
    text: $localize`:@@Component.Sentiment.Note5:très satisfait`,
  },
] as const;

export const SENTIMENTS_DESC = [...SENTIMENTS_ASC].reverse();
