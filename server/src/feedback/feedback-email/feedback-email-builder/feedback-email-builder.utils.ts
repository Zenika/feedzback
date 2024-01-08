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

export const mapTextToHtml = (value: string | null | undefined): string => {
  const paragraphArray = (value ?? '')
    .replaceAll(/\n{3,}/g, '\n\n')
    .split('\n\n')
    .map((paragraph) => paragraph.trim().replaceAll('<', '&lt;').replaceAll('>', '&gt;').split('\n').join('<br />'))
    .filter((multiLineParagraph) => multiLineParagraph !== '');

  const style = 'style="margin-bottom: 16px; color: #333333"';

  return `<div ${style}>${paragraphArray.join(`</div><div ${style}>`)}</div>`;
};
