
import {Datastore} from '@google-cloud/datastore';
import getNameFromEmail from '../model/getNameFromEmail.js';
import dotEnv from 'dotenv'

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
  dotEnv.config();
  const envi = process.env.NODE_ENV || 'development';
  const pointsPositifs = message.pointsPositifs.replace(/\n/g, '<br>');
  const axesAmeliorations = message.axesAmeliorations.replace(/\n/g, '<br>');
  const commentaire = message.commentaire.replace(/\n/g, '<br>');

  if (envi=='development') {
    return 'le feedback a été envoyé(une reponse automatique en mode '+
      'de developement)';
  }

  const msg = {
    to: email,
    from: 'feedzback@zenika.com',
    template_id: 'd-0015050451894264ba6885324349ab71',
    dynamic_template_data: {
      name: recever[0],
      senderName: message.nom,
      pointsPositifs: pointsPositifs,
      axesAmeliorations: axesAmeliorations,
      commentaire: commentaire,
    },
  };

  try {
    const res = await sgMail.send(msg).then(()=>{
      return 'le feedback a été envoyé!';
    }).catch(()=>{
      // eslint-disable-next-line quotes
      return "Le feedback n'est pas envoyé, vérifier les données"+
      // eslint-disable-next-line quotes
      + "s'il vous plaît";
    });
    insertValue(msg);
    return res;
  } catch (error) {
    return error;
  }
};
