import getNameFromEmail from "./getNameFromEmail.js";

export function feedbackRequestTemplate (html,email,senderEmail,textRequest) {

    const senderName = getNameFromEmail(email).split(' ');
    const name = getNameFromEmail(senderEmail);
    let text='';
    if(String(textRequest )!= '')
    text = String(textRequest).replace(/\n/g, '<br>')

    const template = html.split('{{').map((i)=> {
        const symbole = i.substring(0,i.indexOf('}}')).trim();
        switch(symbole) {
            case 'name':
                return i.replace(symbole + '}}',"Bonjour " + name);
            case 'senderName':
                return i.replace(symbole + '}}', senderName[0]);
            case 'text':
                return i.replace(symbole +'}}',text)
        
        }
    }).join('');


    return template;

}