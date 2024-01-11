import { LocaleId } from '../../../core/context';
import { GivenContent, RequestedContent } from './feedback-email-builder.types';

export const requestedContentMap: Record<LocaleId, RequestedContent> = {
  fr: {
    lang: 'fr',
    title: 'Demande de feedZback',
    message: 'Une demande de feedZback vous a été envoyée par',
    cta: 'Donner mon feedZback',
  },
  en: {
    lang: 'en',
    title: 'FeedZback request',
    message: 'A feedZback request has been sent to you by',
    cta: 'Give my feedZback',
  },
};

export const givenContentMap: Record<LocaleId, GivenContent> = {
  fr: {
    lang: 'fr',
    title: 'FeedZback reçu',
    message: 'Vous avez reçu un feedZback de',
    cta: 'Consulter mon feedZback',
  },
  en: {
    lang: 'en',
    title: 'FeedZback received',
    message: 'You have received a feedZback from',
    cta: 'See my feedZback',
  },
};

export const sharedContentMap: Record<LocaleId, GivenContent> = {
  fr: {
    lang: 'fr',
    title: 'FeedZback partagé',
    message: 'Un feedZback vous a été partagé par',
    cta: 'Consulter le feedZback',
  },
  en: {
    lang: 'en',
    title: 'FeedZback shared',
    message: 'A feedZback has been shared with you by',
    cta: 'See the feedZback',
  },
};
