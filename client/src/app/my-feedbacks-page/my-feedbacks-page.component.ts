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
  public feedbackType: typeof FeedbackType = FeedbackType;
  public receivedFeedbacks: Feedback[] = [];
  public sentFeedbacks: Feedback[] = [];
  public email = this.authService.userSnapshot?.email!;

  constructor(
    private authService: AuthService,
    private graphqlService: GraphqlService,
  ) {}

  ngOnInit(): void {
    this.graphqlService
        .getFeedbackList(this.email)
        .subscribe(({receivedFeedbacks, sentFeedbacks}: any) => {
          this.receivedFeedbacks = receivedFeedbacks;
          this.sentFeedbacks = sentFeedbacks;
        });
  }
}
