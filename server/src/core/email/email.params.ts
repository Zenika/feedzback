import { MailgunMessageData } from 'mailgun.js/definitions';

export type SendParams = Required<Pick<MailgunMessageData, 'from' | 'subject' | 'html'> & { to: string }>;
