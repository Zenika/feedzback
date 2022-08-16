import ejs from 'ejs';
import dotEnv from 'dotenv';
export default function replaceHtmlVars(html, message) {
  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config();
  }
  const urlClient = process.env.NODE_ENV !== 'production'? process.env.URL_CLIENT : 'https://feedzback.zenika.com';
  const feedbackUrl = `/feedback/${message.feedbackId}/Received`;
  const template = ejs.render(html, {
    name: message.receverName,
    senderName: message.senderName,
    urlClient: urlClient + feedbackUrl,
  });
  return template;
}
