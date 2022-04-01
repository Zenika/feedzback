const { getNameFromEmail } = require("./getNameFromEmail");



module.exports  = (sendRequest) =>{

    let recever =getNameFromEmail(sendRequest.email); 
    let recerveFistName;
     recerveFistName= recever.split(" ");
    let sender = sendRequest.nom
    let footer =  "Si toi aussi tu souhaites faire un feedzback, rendez-vous sur la plateforme Feedzback:\n" + 
    "https://client-service-dot-feedzback-343709.ew.r.appspot.com/formulaire" + "\n\n" +
    "L’équipe Feedzback";


    return   "Bonjour "+ recerveFistName[0]+", \n\n" +
    "Votre collègue"+ sender+" vous a fait un feedzback !\n\n"
    +"Points positifs: \n"  +
    sendRequest.pointsPositifs + " \n" +
   
    "Axes d'améliorations: \n" +
    sendRequest.axesAmeliorations + " \n" + 
    sendRequest.commentaire===''?footer: +
    "Commentaire: \n" +
    sendRequest.commentaire+"\n" +
    footer;
    

};


