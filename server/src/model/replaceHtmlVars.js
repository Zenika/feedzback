import getNameFromEmail from "./getNameFromEmail.js";
import ejs from 'ejs'
export default function replaceHtmlVars(html, message, email) {
    const recever = getNameFromEmail(email).split(' ');

  const pointsPositifs = String(message.pointsPositifs).replace(/\n/g, '<br>');
  const axesAmeliorations = String(message.axesAmeliorations).replace(/\n/g, '<br>');
  let commentaire = '';
  if(message.commentaire)
  commentaire = String(message.commentaire).replace(/\n/g, '<br>');
  const template = ejs.render(html,{
    name: recever[0],
    senderName: message.nom,
    pointsPositifs: pointsPositifs,
    axesAmeliorations: axesAmeliorations,
    commentaire: commentaire 
})
  
  return template;
}
