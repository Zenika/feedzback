import { feedbackRequestTemplate } from "../model/feedbackRequestTemplate.js"
import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const emailTemplate = fs.readFileSync(__dirname + '/../emailTemplate/askFeedbackModel.html').toString();


  require('dotenv').config();


console.log("heyoooooooooooooooo" + process.env.API_KEY);
const apiKey  = process.env.API_KEY;
const domain = process.env.DOMAIN;

const myMailgun =  mailgun({
  apiKey: apiKey,
  domain: domain,
});

export const askFeedback = async ({email, senderEmail, text})=> {
    
    const template = feedbackRequestTemplate(emailTemplate,email, senderEmail, text);
    const msg = {
        to: "bnyat.azizsharif@zenika.com",
        from: "binyat.sharif@gmail.com",
        subject: "Solliciter un feedback",
        html: template
    }

    const res = await myMailgun.messages().send(msg).then(()=> {return 'Votre demande a bien été envoyé'})
    .catch(()=> {return "Votre demande n'est pas envoyé vérifiez les données s'il vous plaît"});

    return res;

 }