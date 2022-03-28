import { SendRequest } from "./sendRequest";

export class EmailModel{
    constructor(){}
    getNameFromEmail(email:String){
        let parts = email.split("@");
        let username = parts[0];
        let delimetres = [".","-","_"];
        let fname: string="" ;
        let lname: string="" ;
        delimetres.forEach(splittingLoop);
       

       function splittingLoop(element: any , index: any,array: any){
        
        let parts_name = username.replace(/\d+/g, '');
        let num = parts_name.indexOf(element);
        if(num>-1){
            fname = parts_name.substring(0,(num));
            lname = parts_name.substring(num +1,(parts_name.length));
           fname = fname.charAt(0).toUpperCase() + fname.slice(1);
           lname = lname.charAt(0).toUpperCase() + lname.slice(1);
           
        }
       

        

        
        }
        return fname + " " +lname;
    }
   
    getEmailModel(sendRequest:SendRequest){
        let recever = this.getNameFromEmail(sendRequest.to);
        let recerveFistName = recever.split(" ");
        let sender = this.getNameFromEmail(sendRequest.email);

        return "Bonjour "+ recerveFistName[0]+", \n\n" +
        "Vous avez reçu un feedback de la part de votre collègue "+ sender+"\n\n"
        +"Points positis: \n"  +
        sendRequest.pointsPositifs + " \n" +
        "##############################################\n\n"+
       
        "Axes d'amélioratoins: \n\n" +
        sendRequest.axesAmeliorations + " \n" + 
        "##############################################n\n\n"+
        "Commentaie: \n\n" +
        sendRequest.commentaire;

    }
}