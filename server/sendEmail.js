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
module.exports = async ({ email,to, message }) => {
  console.log("hey "+ message.email)
 let model = emailModel(message);
 console.log(" no" + model)

  const msg = {
      to: to,
      from:email,
      subject:"Feedback",
      text:model
  }
  global.result = "sent"
  console.log(global.result);
  try {
    
 const res = await sgMail.send(msg).then((response)=>{
   console.log(response);
   return "le feedback à été envoyé!";
 }).catch((response)=>{
  console.log("hata era " + response);
  return "Le feedback n'est pas envoyé, vérifier les données s'il vous plaît";
 });
       insertValue(msg);
       return res;
      
  } catch(error){
    return error;
  }

}
