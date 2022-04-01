const { getNameFromEmail } = require("./getNameFromEmail");



module.exports  = (sendRequest) =>{

    let recever =getNameFromEmail(sendRequest.email); 
    let recerveFistName;
     recerveFistName= recever.split(" ");
    let sender = sendRequest.nom

    return   "Bonjour "+ recerveFistName[0]+", \n\n" +
    "Vous avez reçu un feedzback de la part de votre collègue "+ sender+"\n\n"
    +"Points positifs: \n\n"  +
    sendRequest.pointsPositifs + " \n" +
    "##############################################\n\n"+
   
    "Axes d'améliorations: \n\n" +
    sendRequest.axesAmeliorations + " \n" + 
    "##############################################n\n\n"+
    "Commentaire: \n\n" +
    sendRequest.commentaire;

};


