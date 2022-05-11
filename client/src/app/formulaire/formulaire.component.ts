import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Apollo, gql} from 'apollo-angular';

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
    const params = JSON.parse(this.activateRouter.snapshot.paramMap.get('params')!);
    console.log(params.senderName)

    let data;
    if(params)
    data = decodeURIComponent(params!).split('&')
  //  console.log(data)
    this.sendRequest = new SendRequest();
    if(data){
      this.sendRequest.nom = data[0].split('=')[1]
      this.sendRequest.email = data[1].split('=')[1]
      this.sendRequest.receverName = data[2].split('=')[1]
      this.sendRequest.receverEmail = data[3].split('=')[1]
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
