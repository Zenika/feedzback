import { MailgunMessageData } from 'mailgun.js';

export type SendParams = Required<Pick<MailgunMessageData, 'from' | 'subject' | 'html'> & { to: string }>;
