import ejs from 'ejs';
import dotEnv from 'dotenv';

export function feedbackRequestTemplate(html, {name, email, senderName, senderEmail, text}) {
  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config();
  }

  const receverEmail = encodeURIComponent(email);
  senderEmail = encodeURIComponent(senderEmail);
  const receverName = name;
  let commentaire='';
  if (text) {
    commentaire = String(text).replace(/\n/g, '<br>');
  }
  const envi = process.env.NODE_ENV || 'development';
  const params = new URLSearchParams({senderName, senderEmail, receverName, receverEmail}).toString();
  const template = ejs.render(html,
      {name: senderName,
        senderName: name,
        text: commentaire,
        urlClientForm: process.env.URL_CLIENT,
        params: params
     })
  return template;
}
