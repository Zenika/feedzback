exports.getNameFromEmail =   (email)=>
{
        let parts = email.split("@");
        let username = parts[0];
        let delimetres = [".","-","_"];
        let fname="" ;
        let lname="" ;
        delimetres.forEach(splittingLoop);
       

       function splittingLoop(element , index,array){
        
        let parts_name = username.replace(/\d+/g, '');
        let num = parts_name.indexOf(element);
        if(num>-1){
            fname = parts_name.substring(0,(num));
            lname = parts_name.substring(num +1,(parts_name.length));
           fname = fname.charAt(0).toUpperCase() + fname.slice(1);
           lname = lname.charAt(0).toUpperCase() + lname.slice(1);
           
        }
       
    console.log(fname + " " +lname);
        
      
  
        
        }
        return fname + " " +lname;
    }   
  