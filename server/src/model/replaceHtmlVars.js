import ejs from 'ejs'
import dotEnv from 'dotenv'
export default function replaceHtmlVars(html, message) {

  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config()
  }

  const positiveFeedback = String(message.positiveFeedback).replace(/\n/g, '<br>');
  const toImprove = String(message.toImprove).replace(/\n/g, '<br>');

  let comment = '';
  if (message.comment)
    comment = String(message.comment).replace(/\n/g, '<br>');

  const template = ejs.render(html, {
    name: message.receverName,
    senderName: message.senderName,
    positiveFeedback,
    toImprove,
    comment,
    urlClientForm: process.env.URL_CLIENT_FORM
  })

  return template;
}
