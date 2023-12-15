import { GivenContent, Language, RequestedContent } from './feedback-email-builder.types';

export const requestedContentMap: Record<Language, RequestedContent> = {
  fr: {
    lang: 'fr',
    title: 'Demande de FeedZback',
    message: 'Une demande de FeedZback vous a été envoyée par',
    cta: 'Donner mon FeedZback',
  },
};

export const givenContentMap: Record<Language, GivenContent> = {
  fr: {
    lang: 'fr',
    title: 'FeedZback reçu',
    message: 'Vous avez reçu un FeedZback de',
    cta: 'Consulter mon FeedZback',
  },
};
