import { LocaleId } from '../../../core/context';

/* ----- Requested feedback ----- */

export type RequestedContent = {
  lang: LocaleId;
  title: string;
  message: string;
  cta: string;
};

export type RequestedData = {
  receiverEmail: string;
  message: string;
  cta: string;
  serverBaseUrl: string;
};

/* ----- Given feedback ----- */

export type GivenContent = {
  lang: LocaleId;
  title: string;
  message: string;
  cta: string;
};

export type GivenData = {
  giverEmail: string;
  cta: string;
  serverBaseUrl: string;
};

/* ----- Shared feedback ----- */

export type SharedContent = {
  lang: LocaleId;
  title: string;
  message: string;
  cta: string;
};

export type SharedData = {
  managedEmail: string;
  cta: string;
  serverBaseUrl: string;
};
