import {Component, OnInit} from '@angular/core';
import {Feedback} from '../model/feedback';
import {FeedbackType} from '../enum/feedback-type';
import {AuthService} from '../services/auth.service';
import {GraphqlService} from '../services/graphql/graphql.service';

@Component({
  selector: 'app-my-feedbacks-page',
  templateUrl: './my-feedbacks-page.component.html',
  styleUrls: ['./my-feedbacks-page.component.css'],
})
export class MyFeedbacksPageComponent implements OnInit {
  receivedFeedbacks: Feedback[] = [];

  sentFeedbacks: Feedback[] = [];

  feedbackType: typeof FeedbackType = FeedbackType;

  constructor(
    private authService: AuthService,
    private graphqlService: GraphqlService,
  ) {}

  ngOnInit() {
    this.getFeedbackList();
  }

  private async getFeedbackList() {
    const email = this.authService.getUserDetails().email;
    const token = await this.authService.getUserTokenId();

    this.graphqlService
        .getFeedbackList({email, token})
        .subscribe(({receivedFeedbacks, sentFeedbacks}: any) => {
          this.receivedFeedbacks = receivedFeedbacks;
          this.sentFeedbacks = sentFeedbacks;
        });
  }
}
