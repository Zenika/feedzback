import { feedbackRequestTemplate } from "../model/feedbackRequestTemplate.js"
import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import admin from 'firebase-admin'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const emailTemplate = fs.readFileSync(__dirname + '/../emailTemplate/askFeedbackModel.html').toString();

if (process.env.NODE_ENV !== 'production') {
  dotEnv.config();
}

const apiKey  = process.env.API_KEY;
const domain = process.env.DOMAIN;

const myMailgun =  mailgun({
  apiKey: apiKey,
  domain: domain,
});

export const askFeedback = async ({askFeedback})=> {
    
    const template = feedbackRequestTemplate(emailTemplate, askFeedback);
    let msg = {
        to: askFeedback.senderEmail,
        from: process.env.GENERIC_EMAIL,
        subject: "Solliciter un feedback",
        html: template
    }

    if(process.env.NODE_ENV !== 'production') {
      msg = {
        ...msg,
        to: "feedzback@zenika.com",
      }

    } 
    const auth = await admin.auth().verifyIdToken(askFeedback.token).catch(()=> {return false})
    if(!auth)
    return "vous n'etes pas authorisé";
    const res = await myMailgun.messages().send(msg).then(()=> {return 'sent'})
    .catch(()=> {return 'error'});

    return res;
 }
