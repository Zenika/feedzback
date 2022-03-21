const sgMail = require('@sendgrid/mail')
const {Datastore} = require('@google-cloud/datastore');
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
module.exports =  ({ email, message }) => {
  console.log('deta');
  const msg = {
      to: 'bnyat.azizsharif@zenika.com',
      from:email,
      subject:message,
      text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail.send(msg).then(()=>{
      console.log('sent!')
       insertValue(msg);
  });
  


}