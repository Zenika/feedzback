import ejs from 'ejs';
import dotEnv from 'dotenv';
/**
 * replacing variables in the template by the message
 * returns an email template
 * @param {String} html
 * @param {String} message
 * @return {String}
 */
export default function replaceHtmlVars(html, message) {
  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config();
  }
  /**
   * set feedback Id in the url which the recever could click on it in the received
   * to see the received feedback
   */
  const urlClient = process.env.NODE_ENV !== 'production'? process.env.URL_CLIENT : 'https://feedzback.zenika.com';
  const feedbackUrl = `/feedback/${message.feedbackId}/Received`;
  /**
   * replace variable in the html template by using ejs.render
   * if you take look at the html in emailTemplate you can find name, senderName that will be replaced
   * in this section
   */
  const template = ejs.render(html, {
    name: message.receverName,
    senderName: message.senderName,
    urlClient: urlClient + feedbackUrl,
  });
  return template;
}
