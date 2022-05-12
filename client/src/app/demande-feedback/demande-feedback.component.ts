import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AskFeedbackRequest } from '../model/askFeedbackRequest';

const SEND_FEEDBACK_REQUEST = gql`
mutation MUTATION_REQUEST($email:String!, $senderEmail:String!, $text:String){
  sendFeedbackRequest(email:$email, senderEmail:$senderEmail, text:$text)
}
`

@Component({
  selector: 'app-demande-feedback',
  templateUrl: './demande-feedback.component.html',
  styleUrls: ['./demande-feedback.component.css']
})
export class DemandeFeedbackComponent implements OnInit {

  askFeedbackRequest!: AskFeedbackRequest

  @ViewChild('feedbackForm', {static: false})
  askFeedback!: NgForm;
  result!:String

  constructor(private apollo:Apollo, private router:Router) { }

  ngOnInit(): void {
    this.askFeedbackRequest= new AskFeedbackRequest();
  }
  onSubmitRequest(){
    this.apollo.mutate({
      mutation: SEND_FEEDBACK_REQUEST,
      variables: {
        email: this.askFeedbackRequest.email,
        senderEmail: this.askFeedbackRequest.senderEmail,
        text: this.askFeedbackRequest.text
      }
    }).subscribe((data:any)=> {
      this.result =  data.data.sendFeedbackRequest;
      this.router.navigate(['/demandeEnvoye', {result: this.result}])
    })
  }

}
