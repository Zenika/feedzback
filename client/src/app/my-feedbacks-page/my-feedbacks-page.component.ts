import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Subject, takeUntil } from 'rxjs';
import { Feedback } from '../model/feedback';
import { FeedbackType } from '../enum/feedback-type';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-feedbacks-page',
  templateUrl: './my-feedbacks-page.component.html',
  styleUrls: ['./my-feedbacks-page.component.css']
})
export class MyFeedbacksPageComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  public feedbackType: typeof FeedbackType = FeedbackType;

  private query = gql`
    query GetFeedbacks($email: String!){
      receivedFeedbacks(email: $email) {
        id
        senderEmail
        senderName
        positiveFeedback
        toImprove
        comment
        createdAt
      }
      sentFeedbacks(email: $email) {
        id
        receverEmail
        receverName
        positiveFeedback
        toImprove
        comment
        createdAt
      }
    }
  `;

  public receivedFeedbacks: Feedback[] = [];
  public sentFeedbacks: Feedback[] = [];

  constructor(private apollo: Apollo, private authService:AuthService) { }

  ngOnInit(): void {
    this.apollo.query({
      query: this.query,
      variables: {
        email: 'bnyat.azizsharif@zenika.com'
      }
    }).pipe(
      map(({ data }) => data),
      takeUntil(this.unsubscribe$)
    ).subscribe(({ receivedFeedbacks, sentFeedbacks }: any) => {
      this.receivedFeedbacks = receivedFeedbacks
      this.sentFeedbacks = sentFeedbacks
      console.log(this.receivedFeedbacks)
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
