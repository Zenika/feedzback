import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Subject, takeUntil } from 'rxjs';
import { Feedback } from '../model/feedback';


@Component({
  selector: 'app-my-feedbacks-page',
  templateUrl: './my-feedbacks-page.component.html',
  styleUrls: ['./my-feedbacks-page.component.css']
})
export class MyFeedbacksPageComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  private query = gql`
    query GetFeedbacks($email: String!){
      feedbacks(email: $email) {
        senderEmail
        senderName
        positiveFeedback
        toImprove
        comment
      }
    }
  `;

  public feedbacks: Feedback[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.query({
      query: this.query,
      variables: {
        email: 'heyy@b.com'
      }
    }).pipe(
      map(({ data }) => data),
      takeUntil(this.unsubscribe$)
    ).subscribe(({ feedbacks }: any) => this.feedbacks = feedbacks)
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
