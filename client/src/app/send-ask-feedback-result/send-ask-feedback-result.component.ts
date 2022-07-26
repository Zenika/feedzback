import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-send-feedback-result',
  templateUrl: './send-ask-feedback-result.component.html',
  styleUrls: ['./send-ask-feedback-result.component.css']
})
export class SendAskFeedbackResultComponent implements OnInit {

  message!: string
  result!: string
  send!: boolean
  title!: string
  src!: string
  constructor(private route: ActivatedRoute) {
    this.message = this.route.snapshot.paramMap.get('message')!
    this.result = this.route.snapshot.paramMap.get('result')!
    this.send = this.message.includes('feedback') ? true : false
    if(!this.send)
    {
      this.title = 'Demande de feedZback'
      this.src = '/assets/question-mark.svg'
    }
    else
    {
      this.title = 'Envoi de feedZback'
      this.src = '/assets/vector-arrow.svg'
    }
     
  }

  ngOnInit(): void {
  }
}
