import ejs from 'ejs'
export default function replaceHtmlVars(html, message) {
  //  const recever = getNameFromEmail(email).split(' ');

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
    commentaire 
})

  
  return template;
}
