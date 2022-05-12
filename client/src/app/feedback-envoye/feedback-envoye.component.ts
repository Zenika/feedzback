import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-envoye',
  templateUrl: './feedback-envoye.component.html',
  styleUrls: ['./feedback-envoye.component.css']
})
export class FeedbackEnvoyeComponent  {

  result!: string
  constructor(private route: ActivatedRoute) {
    this.result = this.route.snapshot.paramMap.get('result')
   }
}
