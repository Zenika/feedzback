import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-send-feedback-result',
  templateUrl: './send-ask-feedback-result.component.html',
  styleUrls: ['./send-ask-feedback-result.component.css']
})
export class SendAskFeedbackResultComponent {
  message!: string
  result!: string
  send!: boolean
  title!: string
  src!: string
  feedbackId!: string
  myRouterLink!: string
  constructor (private route: ActivatedRoute) {
    this.message = this.route.snapshot.paramMap.get('message')!
    this.result = this.route.snapshot.paramMap.get('result')!
    this.feedbackId = this.route.snapshot.paramMap.get('id')!
    this.send = !!this.message.includes('feedback')
    if (!this.send) {
      this.title = 'Demande de feedZback'
      this.src = '/assets/question-mark.svg'
      this.myRouterLink = '/home'
    } else {
      this.title = 'Envoi de feedZback'
      this.src = '/assets/vector-arrow.svg'
      this.myRouterLink = `/feedback/${this.feedbackId}/Sent`
    }
  }
}
