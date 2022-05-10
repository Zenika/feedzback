import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Apollo, gql} from 'apollo-angular';

import {SendRequest} from '../model/sendRequest';

const SEND_MESSAGE = gql`
mutation CreateMessage($email:String!,$message:SendRequest!){
  createMessage(email:$email,message:$message)
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
    //  console.logthis.activateRouter.snapshot.paramMap.get('email')
    console.log(JSON.stringify(activateRouter.snapshot.paramMap))
   }


  ngOnInit(): void {
    this.sendRequest = new SendRequest();
  }


  onSubmit() {
    console.log("heyyyy")
    this.apollo.mutate({
      mutation: SEND_MESSAGE,
      variables: {
        email: this.sendRequest.email,
        message: this.sendRequest,
      },
    }).subscribe((data:any)=>{
      this.result = data.data.createMessage;
      console.log(data.data.createMessage)
      this.result ==='Votre feedback a été envoyé!'? this.router.navigate(['/feedbackEnvoye']):this.result;
    });
  }
}
