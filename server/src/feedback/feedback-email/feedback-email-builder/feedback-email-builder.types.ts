export type Language = 'fr' /* | 'en' */;

/* ----- Requested feedback ----- */

export type RequestedContent = {
  lang: Language;
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
  lang: Language;
  title: string;
  message: string;
  cta: string;
};

export type GivenData = {
  senderEmail: string;
  cta: string;
  serverBaseUrl: string;
};
