import getNameFromEmail from "./getNameFromEmail.js";

export default function replaceHtmlVars(html, message, email) {
    const recever = getNameFromEmail(email).split(' ');
//   dotEnv.config();
//   const envi = process.env.NODE_ENV || 'development';
  const pointsPositifs = message.pointsPositifs.replace(/\n/g, '<br>');
  const axesAmeliorations = message.axesAmeliorations.replace(/\n/g, '<br>');
  const commentaire = message.commentaire.replace(/\n/g, '<br>');

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