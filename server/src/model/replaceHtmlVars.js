import ejs from 'ejs'
import dotEnv from 'dotenv'
export default function replaceHtmlVars(html, message) {

  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config()
  }

  const envi = process.env.NODE_ENV || 'development';
  const template = ejs.render(html, {
    name: message.feedbackId,
    senderName: message.senderName,
    urlClientForm: `http://feedzback.zenika.com/feedback/${message.feedbackId}/Received`
  })

  return template;
}
