
import {Datastore} from '@google-cloud/datastore';

import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import replaceHtmlVars from '../model/replaceHtmlVars.js';
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



const emailTemplate = fs.readFileSync(__dirname + '/../emailTemplate/emailModel.html').toString();

// console.log(emailTemplate)

dotEnv.config();

const apiKey  = process.env.API_KEY;
const domain = process.env.DOMAIN;

const myMailgun =  mailgun({
  apiKey: apiKey,
  domain: domain,
});


const datastore= new Datastore({
  projectId: 'feedzback-343709',
});
// const insertValue = (value) => {
//   datastore.save({
//     key: datastore.key('visit'),
//     data: value,
//   });
// };

export const sendEmail = async ({email, message}) => {
  

  dotEnv.config();
  const envi = process.env.NODE_ENV || 'development';
  // if (envi=='development') {
  //   return 'le feedback a été envoyé(une reponse automatique en mode '+
  //     'de developement)';
  // }
  
  const template = replaceHtmlVars(emailTemplate , message , email);
  const msgTemp =   {
    to: 'bnyat.azizsharif@zenika.com',
    from: 'bnyat.azizsharif@zenika.com',
    subject:'FeedZback',
    html: template,

  }


   const res =
   await  myMailgun.messages().send(msgTemp)
   .then(()=> {return "Votre feedback a été envoyé!"})
   .catch(err => {return "Le feedback n'est pas envoyé, vérifier les données  s'il vous plaît"})
    
    // insertValue(msg);
    return res;

  
};
