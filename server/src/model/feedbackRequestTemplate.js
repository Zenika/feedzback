import ejs from 'ejs';
import dotEnv from 'dotenv'

export function feedbackRequestTemplate (html,{name, email, senderName, senderEmail, text}) {

    if (process.env.NODE_ENV !== 'production') {
        dotEnv.config()
      }

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
        urlClientForm: process.env.URL_CLIENT_FORM,
        params: paramsEnc
     })

    return template;
}
