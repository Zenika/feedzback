import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FeedbackType } from '../enum/feedback-type';
import { AskFeedback } from '../model/askFeedback';
import { FeedbackRequest } from '../model/feedbackRequest';
import { AuthService } from '../services/auth.service';
import { GraphqlService } from '../services/graphql/graphql.service';

@Component({
  selector: 'app-ask-feedback-list',
  templateUrl: './ask-feedback-list.component.html',
  styleUrls: ['./ask-feedback-list.component.css']
})
export class AskFeedbackListComponent implements OnInit {
  @Input() askFeedbacks!: AskFeedback[];
  @Input() type!: FeedbackType;
  public feedbackType: typeof FeedbackType = FeedbackType;
  sortedAskFeedbackList!: AskFeedback[];
  datePipe!: DatePipe;
  loading: boolean = false;
  resendButtonSrc = '../../assets/loadResendAskFeedback.svg';
  pauseButtonSrc = '../../assets/resendAskFeedback.svg'
  clickedAskFeedbackId: String = '';

  constructor(
    private authService: AuthService,
    private graphqlService: GraphqlService) { 
      graphqlService.loading.subscribe((loading) => {
        this.loading = loading;
      })
    }

   ngOnInit(): void {
    this.datePipe = new DatePipe('en-US');
  }

  ngAfterContentChecked(): void {
    this.sortAskFeedbackList();
  }

  sortAskFeedbackList() {
    this.sortedAskFeedbackList = [...this.askFeedbacks];
    this.askFeedbacks.forEach(e => console.log(' el ' + e.lastResendDate))
    this.sortedAskFeedbackList.sort(
        (a, b) =>
          new Date(
          this.datePipe.transform(b.createdAt, 'yyyy-MM-dd')!,
          ).getTime() -
        new Date(this.datePipe.transform(a.createdAt, 'yyyy-MM-dd')!).getTime(),
    );
  }
  async resendAskFeedback(askFeedback: AskFeedback) {
    try {
      this.clickedAskFeedbackId = askFeedback.id;
    await this.graphqlService.deleteAskFeedback(askFeedback.id);
    const token = await this.authService.getUserTokenId();
    const feedbackRequest = new FeedbackRequest(
      token!,
      askFeedback.senderName,
      askFeedback.senderEmail,
      askFeedback.receverName,
      askFeedback.receverEmail,
      askFeedback.text,
      askFeedback.createdAt
    );
    this.graphqlService.askFeedback(feedbackRequest)
    } catch(error) {
      console.log(error);
    }
  }

}
