import ejs from 'ejs';
import dotEnv from 'dotenv';


/**
 * Replace request feedback html template variables by the given feedback which includes
 * name, email, senderName...
 * @param {String} html
 * @param {Object} param1
 * @return {String}
 */
export function feedbackRequestTemplate(html, {email,senderName, senderEmail, text}) {
  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config();
  }

  let commentaire='';  /**
   * as comment is optional we replace html tags in case the request includes a comment (text)
   */
  if (text) {
    commentaire = String(text).replace(/\n/g, '<br>');
  }
  /*
  the sender becomes receiver and the receiver becomes sender
  */
  const receverEmail = email;
  email = senderEmail;
  const urlClient = process.env.NODE_ENV !== 'production'? process.env.URL_CLIENT + '/send' : 'https://feedzback.zenika.com/send';
  const params = new URLSearchParams({email, receverEmail}).toString();
  const template = ejs.render(html,
      {
        email: senderEmail,
        senderName: senderName,
        text: commentaire,
        urlClientForm: urlClient,
        params: params,
      });
  return template;
}
