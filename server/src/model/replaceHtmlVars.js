import ejs from 'ejs'
import dotEnv from 'dotenv'
export default function replaceHtmlVars(html, message) {
  
  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config()
  }

  const pointsPositifs = String(message.pointsPositifs).replace(/\n/g, '<br>');
  const axesAmeliorations = String(message.axesAmeliorations).replace(/\n/g, '<br>');

  let commentaire = '';
  if(message.commentaire)
  commentaire = String(message.commentaire).replace(/\n/g, '<br>');

  const template = ejs.render(html,{
    name: message.receverName,
    senderName: message.nom,
    pointsPositifs,
    axesAmeliorations,
    commentaire,
    urlClientForm: process.env.URL_CLIENT_FORM 
})

  return template;
}
