import { Language } from './feedback-email-builder.types';

export const SUPPORTED_LANGUAGES: Language[] = ['fr'];

export const DEFAULT_LANGUAGE: Language = 'fr';

export const matchLanguage = (languages: string[]): Language => {
  return (
    languages.find((language): language is Language => (SUPPORTED_LANGUAGES as string[]).includes(language)) ??
    DEFAULT_LANGUAGE
  );
};

export const uglifyEmail = (email: string) => email.replace('@', '<span>@</span>').replaceAll('.', '<span>.</span>');
