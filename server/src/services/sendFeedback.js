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

/**
 * get email html template to send it via mailgun
 */
const emailTemplate = fs.readFileSync(__dirname +
   '/../emailTemplate/emailModel.html').toString();

/**
 * configure environement in case if it's not in production mode
 */
if (process.env.NODE_ENV !== 'production') {
  dotEnv.config();
}

/**
 * get apiKey and domain of zenika mailgun account
 */
const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;

/**
 * the objectif of feedbackId to sendback id of sent feedback to client in case
 * user wants to watch his feedback after sending it
 */
let feedbackId;

/**
 * configure mailgun
 */
const myMailgun = mailgun({
  apiKey: apiKey,
  domain: domain,
});

/**
 * configure datastore
 */
const datastore = new Datastore({
  projectId: 'feedzback-343709',
});

/**
 * this function will insert the feedback in datastore after sending it
 * in callback assigns the feedback id intp feedbackId variable
 * in order to send feedbackId back to client
 * @param {Object} data supposed to be an InputFeedback type
 */
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

/**
 * Takes a feedback object as argmuent then verify the user token first if it comes from a right user
 * then according to the environment (prod ou dev) send the feedback as email and stock it in datastore
 * @param {Object} data type InputFeedback
 * @return {Object} returns an object which is containing a message ( success or failed ) if it's successful
 * the object will contains the feedback id
 */
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
