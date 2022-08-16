import {Datastore} from '@google-cloud/datastore';
import dotEnv from 'dotenv';
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import replaceHtmlVars from '../model/replaceHtmlVars.js';
import admin from 'firebase-admin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const emailTemplate = fs.readFileSync(__dirname +
   '/../emailTemplate/emailModel.html').toString();

if (process.env.NODE_ENV !== 'production') {
  dotEnv.config();
}

const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;
let feedbackId;

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
      'comment',
      'createdAt',
    ],
    data: {
      ...data,
      createdAt: Date.now(),
    },
  }).then((res) => {
    feedbackId = res[0].mutationResults[0].key.path[0].id;
  });
};

export const sendFeedback = async ({feedbackInput}) => {
  let errMsg;
  const auth = await admin.auth().verifyIdToken(feedbackInput.token).catch((error)=> {
    errMsg = error;
    return false;
  });
  if (!auth) {
    return errMsg;
  }
  const envi = process.env.NODE_ENV || 'development';
  try {
    await insertFeedback(feedbackInput);
    feedbackInput.feedbackId = feedbackId;
    const template = replaceHtmlVars(emailTemplate, feedbackInput);
    const msg = {
      to: feedbackInput.receverEmail,
      from: process.env.GENERIC_EMAIL,
      subject: 'FeedZback',
      html: template,
    };
    if (envi !== 'production') {
      msg.to = 'feedzback@zenika.com';
    };
    await myMailgun.messages().send(msg);
    const success = {
      feedbackId: feedbackId,
      message: 'sent',
    };
    return success;
  } catch {
    return {message: 'error'};
  }
};
