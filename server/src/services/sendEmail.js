
import {Datastore} from '@google-cloud/datastore';
import getNameFromEmail from '../model/getNameFromEmail.js';
import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';


dotEnv.config();

const apiKey  = process.env.API_KEY;
const domain = process.env.DOMAIN;

const mygun =  mailgun({
  apiKey: apiKey,
  baseUrl: domain,
});
// const config  = {
//   apiKey: apiKey,
//   domain: domain,
//   host: 'api.eu.mailgun.net'
// }
//const mailgun = new Mailgun({apiKey:apiKey});

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
    from: 'mailgun@zenika.com',
     text: message.pointsPositifs
  };

  //  const res = await
   await  mygun.messages().send(msg).then(res=> console.log(res)).catch(err => console.log(err))
    //   ,(error,body) => {
    //   if(error)  console.log( 'le feedback a été envoyé!');
    //   else console.log("l'email " + body);
    // });
    // insertValue(msg);
    // console.log(res + "erere")
    // return res;

};
