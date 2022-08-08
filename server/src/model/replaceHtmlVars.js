import ejs from 'ejs'
import dotEnv from 'dotenv'
export default function replaceHtmlVars(html, message) {

  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config()
  }
  const feedbackUrl = `/feedback/${message.feedbackId}/Received`;
  const template = ejs.render(html, {
    name: message.feedbackId,
    senderName: message.senderName,
    urlClient: process.env.URL_CLIENT + feedbackUrl
  })
  return template;
}
