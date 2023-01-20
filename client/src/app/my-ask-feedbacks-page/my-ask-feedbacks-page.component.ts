import {Component, OnInit} from '@angular/core';
import {FeedbackType} from '../enum/feedback-type';
import {AskFeedback} from '../model/askFeedback';
import {AuthService} from '../services/auth.service';
import {GraphqlService} from '../services/graphql/graphql.service';

@Component({
  selector: 'app-my-ask-feedbacks-page',
  templateUrl: './my-ask-feedbacks-page.component.html',
  styleUrls: ['./my-ask-feedbacks-page.component.css'],
})
export class MyAskFeedbacksPageComponent implements OnInit {
  public feedbackType: typeof FeedbackType = FeedbackType;
  public receivedAskFeedbacks: AskFeedback[] = [];
  public sentAskFeedbacks: AskFeedback[] = [];
  public email!: string;
  constructor(
   private authService: AuthService,
   private graphqlService: GraphqlService) {
    this.email = authService.getUserDetails().email;
  }

  ngOnInit(): void {
    this.graphqlService
        .getAskFeedbackList(this.email)
        .subscribe(({receivedAskFeedbacks, sentAskFeedbacks}: any) => {
          this.receivedAskFeedbacks = receivedAskFeedbacks;
          this.sentAskFeedbacks = sentAskFeedbacks;
        });
  }
}
