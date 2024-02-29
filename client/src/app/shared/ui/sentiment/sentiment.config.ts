import { SentimentConfig } from './sentiment.types';

export const SENTIMENTS_ASC: SentimentConfig[] = [
  {
    note: 1,
    icon: 'thumb_down',
    text: $localize`:@@Component.Sentiment.Note1:c'est pas pour moi`,
  },
  {
    note: 3,
    icon: 'thumb_up',
    text: $localize`:@@Component.Sentiment.Note3:j'aime bien`,
  },
  {
    note: 5,
    icon: 'recommended',
    text: $localize`:@@Component.Sentiment.Note5:j'adore`,
  },
] as const;

export const SENTIMENTS_DESC = [...SENTIMENTS_ASC].reverse();
