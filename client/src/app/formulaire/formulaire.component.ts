import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Apollo, gql} from 'apollo-angular';
import { param } from 'cypress/types/jquery';

import {SendRequest} from '../model/sendRequest';

const SEND_MESSAGE = gql`
mutation CreateMessage($sendRequest:SendRequest!){
  createMessage(sendRequest:$sendRequest)
}
`;

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css'],
})

export class FormulaireComponent implements OnInit {
  sendRequest!:SendRequest;
  result!:String;


  @ViewChild('feedbackForm', {static: false})
    feedbackForm!: NgForm;


  constructor(private apollo:Apollo, private activateRouter:ActivatedRoute, private router:Router) {
    
   }


  ngOnInit(): void {
    this.sendRequest = new SendRequest();
    
    const senderName = this.activateRouter.snapshot.queryParamMap.get('senderName')
    const senderEmail= this.activateRouter.snapshot.queryParamMap.get('senderEmail')
    const receverName= this.activateRouter.snapshot.queryParamMap.get('receverName')
    const receverEmail= this.activateRouter.snapshot.queryParamMap.get('receverEmail')
    
    if (senderName && senderEmail && receverName && receverEmail) {
      this.sendRequest.nom = senderName
      this.sendRequest.email = senderEmail
      this.sendRequest.receverName = receverName
      this.sendRequest.receverEmail = receverEmail
    }
  }


  onSubmit() {
    this.apollo.mutate({
      mutation: SEND_MESSAGE,
      variables: {
        sendRequest: this.sendRequest,
      },
    }).subscribe((data:any)=>{
      this.result = data.data.createMessage;
      this.result ==='Votre feedback a été envoyé!'? this.router.navigate(['/feedbackEnvoye']):this.result;
    });
  }
}
