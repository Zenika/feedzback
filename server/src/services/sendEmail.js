
import { Datastore } from '@google-cloud/datastore';
import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import replaceHtmlVars from '../model/replaceHtmlVars.js';
import admin from 'firebase-admin';
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const emailTemplate = fs.readFileSync(__dirname + '/../emailTemplate/emailModel.html').toString();

if (process.env.NODE_ENV !== 'production') {
  dotEnv.config()
}

const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;

const myMailgun = mailgun({
  apiKey: apiKey,
  domain: domain,
});

const datastore = new Datastore({
  projectId: 'feedzback-343709',
});

const insertFeedback = async (data) => {
  await datastore.save({
    key: datastore.key('feedzback'),
    excludeFromIndexes: [
      'senderName',
      'receverName',
      'positiveFeedback',
      'toImprove',
      'comment'
    ],
    data
  })
}

export const sendEmail = async ({ sendRequest }) => {
 
  const auth  = await  admin.auth().verifyIdToken(sendRequest.token).catch(()=> { return false})
  if(!auth)
  return "Vous n'êtes pas authorisé";
  
  const envi = process.env.NODE_ENV || 'development';
  const template = replaceHtmlVars(emailTemplate, sendRequest);

  const msg = {
    to: sendRequest.receverEmail,
    from: sendRequest.email,
    subject: 'FeedZback',
    html: template,
  }
  if (envi !== 'production') {
    msg.to = 'feedzback@zenika.com'
    msg.from = 'feedzback@zenika.com'
  }

  try {
    await insertFeedback(sendRequest)
    await myMailgun.messages().send(msg)
    return "sent";
  } catch (e) {
    console.error(e)
    return "error"
  }
};
