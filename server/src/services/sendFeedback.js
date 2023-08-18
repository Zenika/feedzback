/** @module sendFeedback */
import datastore from '../../index.js'
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
 * Takes a feedback object as argmuent then send it by mailgun and save it in google datastore
 * @param {Object} data type InputFeedback
 * @return {Object} returns an object which is containing a message ( success or failed ) if it's successful
 * the object will contains the feedback id
 */
export const sendFeedback = async ({feedbackInput}) => {
  let errMsg;
  /**
   * when user send a request from client side this request should hold a valid token and the below code verify the user token
   * by using firebase admin
   * @type {boolean}
   */
  const auth = await admin.auth().verifyIdToken(feedbackInput.token).catch((error)=> {
    errMsg = error;
    return false;
  });
  // if (!auth) {
  //   return errMsg;
  // }
  const envi = process.env.NODE_ENV || 'development';
  try {
    await insertFeedback(feedbackInput);
    feedbackInput.feedbackId = feedbackId;
    /**
     * set html template variables
     * @type {String}
     */
    const template = replaceHtmlVars(emailTemplate, feedbackInput);
    
    /**
     * prepare message object to pass as argument in Mailgun
     * in case if it's in dev mode we send the feedback to the generic email
     * @type {Object}
     */
    const msg = {
      to: feedbackInput.receverEmail,
      from: process.env.GENERIC_EMAIL,
      subject: 'Vous avez reçu un feedZback',
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
