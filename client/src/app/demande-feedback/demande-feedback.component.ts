import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AskFeedbackRequest } from '../model/askFeedbackRequest';



const SEND_FEEDBACK_REQUEST = gql`
mutation Mutation($askFeedback: AskFeedback!) {
  sendFeedbackRequest(askFeedback: $askFeedback)
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
  err!:String

  constructor(private apollo:Apollo, private router:Router, private active: ActivatedRoute) { }

  ngOnInit(): void {
    this.askFeedbackRequest= new AskFeedbackRequest();
  }

  onSubmitRequest(){
    this.apollo.mutate({
      mutation: SEND_FEEDBACK_REQUEST,
      variables: {
       askFeedback: this.askFeedbackRequest
      }
    }).subscribe((data:any)=> {
  
      data.data.sendFeedbackRequest==='Votre demande a bien été envoyé'? this.router.navigate(['/demandeEnvoye']):this.err=data.data.sendFeedbackRequest
    })
  }

}
