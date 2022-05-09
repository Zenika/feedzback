import sanitize from "sanitize-html";
import getNameFromEmail from "./getNameFromEmail.js";
import ejs from 'ejs';
export function feedbackRequestTemplate (html,email,senderEmail,textRequest) {

    const senderName = getNameFromEmail(email).split(' ');
    const name = getNameFromEmail(senderEmail);
    let text='';
    if(textRequest)
    text = String(textRequest).replace(/\n/g, '<br>')

    const template = ejs.render(html ,
     { name:name,
       senderName: senderName,
       text: text
    })

    return template;
}
