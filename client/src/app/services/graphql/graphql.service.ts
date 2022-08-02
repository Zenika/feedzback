import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subject, map, takeUntil } from 'rxjs';
import { Feedback } from 'src/app/model/feedback';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private unsubscribe$: Subject<void> = new Subject();
 
  private getFeedbackListQuery = gql`
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
 private getFeedbackByIdQuery = gql`
 query GetFeedbackById($getFeedbackByIdId: String!) {
    getFeedbackById(id: $getFeedbackByIdId) {
      senderName
      senderEmail
      receverEmail
      receverName
      positiveFeedback
      toImprove
      comment
      createdAt
    }
  }`
  constructor(private apollo: Apollo) { }

  getFeedbackList(email: string) {
    let subjectList = new Subject<Feedback[]>();
    this.apollo.watchQuery({
      query: this.getFeedbackListQuery,
      variables: {
        email: email
      },
      pollInterval: 4500
    
    }).valueChanges.pipe(
      map(({ data }) => data),
      takeUntil(this.unsubscribe$)
    ).subscribe((feedbacks: any) => {
      subjectList.next(feedbacks)
    })
    return subjectList.asObservable()
  }
  getFeedbackById(id:String) {
    let subject = new Subject<Feedback>();

    this.apollo.query({
      query: this.getFeedbackByIdQuery,
      variables: {
        getFeedbackByIdId: id
      }
    }).subscribe(( result : any) => {
     subject.next(result.data.getFeedbackById)
    })
    return subject.asObservable();
  }
}
