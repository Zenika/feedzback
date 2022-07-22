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
  public email!: String
  constructor(private apollo: Apollo, private authService:AuthService) { 
  this.email = authService.getUserDetails().email;
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: this.query,
      variables: {
        email: this.email
      },
      pollInterval: 4500
    
    }).valueChanges.pipe(
      map(({ data }) => data),
      takeUntil(this.unsubscribe$)
    ).subscribe(({ receivedFeedbacks, sentFeedbacks }: any) => {
      this.receivedFeedbacks = receivedFeedbacks
      this.sentFeedbacks = sentFeedbacks
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
