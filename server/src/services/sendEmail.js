
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


if (process.env.NODE_ENV !== 'production') {
  dotEnv.config()
}


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

export const sendEmail = async ({sendRequest}) => {
  
  const envi = process.env.NODE_ENV || 'development';
  const template = replaceHtmlVars(emailTemplate , sendRequest);

  const msgDev =   {
const msg =   {
    to: sendRequest.receverEmail,
    from: sendRequest.email,
    subject:'FeedZback',
    html: template,
  }
  if (envi === 'developpement') {
    msg = {
      ...msg,
      to: 'bnyat.azizsharif@zenika.com',
      from: 'bnyat.azizsharif@zenika.com',
    };
  }
  

  let res;
  res = await  myMailgun.messages().send((envi=='development') ? msgDev : msgProd)
     .then(()=> {return "Votre feedback a été envoyé!(Dev mode)"})
     .catch(err => {return "Le feedback n'est pas envoyé, vérifier les données s'il vous plaît"})
   
   // insertValue(msg); 
    return res;

};
