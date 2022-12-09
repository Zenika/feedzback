/** @module askFeedback */
import {feedbackRequestTemplate} from '../model/feedbackRequestTemplate.js';
import dotEnv from 'dotenv';
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import admin from 'firebase-admin';
import { Datastore } from '@google-cloud/datastore';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const emailTemplate = fs.readFileSync(__dirname + '/../emailTemplate/askFeedbackModel.html').toString();

if (process.env.NODE_ENV !== 'production') {
  dotEnv.config();
}
let feedbackId;
const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;

const myMailgun = mailgun({
  apiKey: apiKey,
  domain: domain,
});

const datastore = new Datastore({
  projectId: 'feedzback-343709',
});

const insertAskFeedback = async (data) => {
  await datastore.save({
    key: datastore.key('askFeedzback'),
    excludeFromIndexes: [
      'senderName',
      'receverName',
      'text',
    ],
    data: {
      ...data,
      createdAt: Date.now(),
    },
  }).then((res) => {
    feedbackId = res[0].mutationResults[0].key.path[0].id;
  }).then(ee=> console.log(ee));
};


/**
 * Takes an object (AskFeedback) and send it as email template by Mailgun to a requested user
 * @param {Object} askFeedback
 * @return {String} result which is sent or error
 */
export const askFeedback = async ({askFeedbackInput})=> {
  /**
   * set template variables
   */
  const template = feedbackRequestTemplate(emailTemplate, askFeedbackInput);
  let msg = {
    to: askFeedbackInput.senderEmail,
    from: process.env.GENERIC_EMAIL,
    subject: 'Demande de feedZback',
    html: template,
  };

  if (process.env.NODE_ENV !== 'production') {
    msg = {
      ...msg,
      to: 'feedzback@zenika.com',
    };
  }
  const auth = await admin.auth().verifyIdToken(askFeedbackInput.token).catch(()=> {
    return false;
  });
 /* if (!auth) {
    return 'vous n\'etes pas authorisé';
  }*/
  await insertAskFeedback(askFeedbackInput);
  askFeedbackInput.feedbackId = feedbackId;
  await myMailgun.messages().send(msg);
  const result = {
    feedbackId: feedbackId,
    message: 'sent',
  }
  return result;
};
