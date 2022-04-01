const sgMail = require('@sendgrid/mail')
const {Datastore} = require('@google-cloud/datastore');
const emailModel = require('./model/emailModel');
require('dotenv').config();
sgMail.setApiKey(process.env.API_KEY);


const datastore  = new Datastore({
  projectId: 'feedzback-343709'
});
const insertValue = value => {
  datastore.save({
    key: datastore.key('visit'),
    data:value});
    

}
module.exports = async ({ email, message }) => {
 let model = emailModel(message);
 const envi = process.env.NODE_ENV || 'development';
 if(envi=='development')
 return;
  const msg = {
      to: email,
      from:"feedzback@zenika.com",
      subject:"Feedback",
      text:model
  }

  try {
    
 const res = await sgMail.send(msg).then(()=>{
   return "le feedback a été envoyé!";
 }).catch(()=>{
  return "Le feedback n'est pas envoyé, vérifier les données s'il vous plaît";
 });
       insertValue(msg);
       return res;
      
  } catch(error){
    return error;
  }

}
