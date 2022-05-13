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
    const query = this.activateRouter.snapshot.queryParamMap;
    this.sendRequest = {
        senderName: query.get('senderName'),
        senderEmail: query.get('senderEmail'),
        receverName: query.get('receverName'),
        receverEmail: query.get('receverEmail'),
    };
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
