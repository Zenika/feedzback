
import {Datastore} from '@google-cloud/datastore';
import getNameFromEmail from '../model/getNameFromEmail.js';
import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



const emailTemplate = fs.readFileSync(__dirname + '/emailModel.html').toString();

console.log(emailTemplate)

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
const insertValue = (value) => {
  datastore.save({
    key: datastore.key('visit'),
    data: value,
  });
};

export const sendEmail = async ({email, message}) => {
  const recever = getNameFromEmail(message.email).split(' ');
  const envi = process.env.NODE_ENV || 'development';
  const pointsPositifs = message.pointsPositifs.replace(/\n/g, '<br>');
  const axesAmeliorations = message.axesAmeliorations.replace(/\n/g, '<br>');
  const commentaire = message.commentaire.replace(/\n/g, '<br>');
/*
  if (envi=='development') {
    return 'le feedback a été envoyé(une reponse automatique en mode '+
      'de developement)';
  }
  */
  const msg = {
     to: 'bnyat.azizsharif@zenika.com',
    from: 'binyat.sharif@gmail.com',
    subject:'hey',


  
  };
  const msgTemp =  {
    template: emailTemplate,
    name: "bnyat",
    senderName: "hey",
    pointsPositifs: "dfdf",
    axesAmeliorations: axesAmeliorations,
    commentaire: commentaire

  }

  //console.log(msgTemp.name)
  //  const res = await
   await  myMailgun.messages().send(msgTemp & msg).then(res=> console.log(res)).catch(err => console.log(err))
    //   ,(error,body) => {
    //   if(error)  console.log( 'le feedback a été envoyé!');
    //   else console.log("l'email " + body);
    // });
    // insertValue(msg);
    // console.log(res + "erere")
    // return res;

  
};
