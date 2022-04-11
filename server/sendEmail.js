const sgMail = require('@sendgrid/mail')
const {Datastore} = require('@google-cloud/datastore');
const { getNameFromEmail } = require('./model/getNameFromEmail');
require('dotenv').config();

const datastore  = new Datastore({
  projectId: 'feedzback-343709'
});
const insertValue = value => {
  datastore.save({
    key: datastore.key('visit'),
    data:value});
    

}
module.exports = async ({ email, message }) => {

 let recever = getNameFromEmail(message.email).split(" ");
 const envi = process.env.NODE_ENV || 'development';
 
 let pointsPositifs = message.pointsPositifs.replace(/\n/g,"<br>");
 let axesAmeliorations = message.axesAmeliorations.replace(/\n/g,"<br>");
 let commentaire = message.commentaire.replace(/\n/g,"<br>");
 console.log(pointsPositifs);
 /*
 if(envi=='development'){
   console.log("les données envoyées " + email + " model " )
  return "le feedback a été envoyé(une reponse automatique en mode de developement)";
 }
*/
  const msg = {
      to: email,
      from:"feedzback@zenika.com",
      template_id:'d-0015050451894264ba6885324349ab71',
      dynamic_template_data:{
        name:recever[0],
        senderName:message.nom,
        pointsPositifs:pointsPositifs,
        axesAmeliorations:axesAmeliorations,
        commentaire:commentaire
      }
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
