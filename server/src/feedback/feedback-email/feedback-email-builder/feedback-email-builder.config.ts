import { GivenContent, Language, RequestedContent } from './feedback-email-builder.types';

export const requestedContentMap: Record<Language, RequestedContent> = {
  fr: {
    lang: 'fr',
    title: 'Demande de feedZback',
    message: 'Une demande de feedZback vous a été envoyée par',
    cta: 'Donner mon feedZback',
  },
};

export const givenContentMap: Record<Language, GivenContent> = {
  fr: {
    lang: 'fr',
    title: 'FeedZback reçu',
    message: 'Vous avez reçu un feedZback de la part de',
    cta: 'Consulter mon feedZback',
  },
};
