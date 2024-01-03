import { AppBaseHref, AppLanguage } from './switch-language.types';

export const mapBaseHrefToLanguage = (baseHref: AppBaseHref): AppLanguage => {
  switch (baseHref) {
    case '/':
      return null;
    case '/fr/':
      return 'fr';
    case '/en/':
      return 'en';
  }
};
