import getNameFromEmail from "./getNameFromEmail.js";

export default function replaceHtmlVars(html, message, email) {
    const recever = getNameFromEmail(email).split(' ');

  const pointsPositifs = String(message.pointsPositifs).replace(/\n/g, '<br>');
  const axesAmeliorations = String(message.axesAmeliorations).replace(/\n/g, '<br>');
  const commentaire = String(message.commentaire).replace(/\n/g, '<br>');

  const template = html.split("{{").map((i)=> {
      const symbole = i.substring(0,i.indexOf('}}')).trim();
      switch(symbole){
        case 'name':
            return i.replace(symbole + '}}' , "Bonjour "+ recever[0])
        case 'senderName':
            return i.replace(symbole + '}}' , message.nom)
        case 'pointsPositifs':
            return i.replace(symbole + '}}' , pointsPositifs)
        case 'axesAmeliorations':
            return i.replace(symbole + '}}' , axesAmeliorations)     
        case 'commentaire':
            return i.replace(symbole + '}}', commentaire)  
      }
  
  }).join('');
  return template;
}