
import getNameFromEmail from "./getNameFromEmail.js";
import ejs from 'ejs';

export function feedbackRequestTemplate (html,{name, email, senderName, senderEmail, text}) {

    const receverEmail = email;
    const receverName = name
    let commentaire='';
    if(text)
    commentaire = String(text).replace(/\n/g, '<br>')

    const params = new URLSearchParams({senderName, senderEmail, receverName, receverEmail})
    const paramsEnc = encodeURIComponent(JSON.stringify({senderName, senderEmail, receverName, receverEmail}));
    const template = ejs.render(html ,
     { name: senderName,
        senderName: name,
        text: commentaire,
        params: paramsEnc
     })

    return template;
}
