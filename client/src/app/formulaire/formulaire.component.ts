import { Component, Directive, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { EmailModel } from '../model/emailModel';
import { SendRequest } from '../model/sendRequest';

const SEND_MESSAGE = gql`
mutation CreateMessage($email:String!,$to:String!,$message:String!){
  createMessage(email:$email,to:$to,message:$message)
}
`;

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})

export class FormulaireComponent implements OnInit {

  sendRequest!:SendRequest;
  emailModel!: EmailModel;
  result!:String;


  @ViewChild('feedbackForm',{static:false})
  feedbackForm!: NgForm;



  constructor(private apollo:Apollo) { }


  ngOnInit(): void {
 
    this.sendRequest = new SendRequest();
    this.emailModel = new EmailModel();

  }


  onSubmit(){
    this.apollo.mutate({
      mutation:SEND_MESSAGE,
      variables:{
        email:this.sendRequest.email,
        to:this.sendRequest.to,
        message:this.emailModel.getEmailModel(this.sendRequest)
      }
    }).subscribe((data:any)=>{
      this.result = data.data.createMessage
    });
  }
}
