import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subject } from 'rxjs';
import { Feedback } from 'src/app/model/feedback';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

 private getFeedbackByIdQuery = gql`
 query GetFeedbackById($getFeedbackByIdId: String!) {
    getFeedbackById(id: $getFeedbackByIdId) {
      senderName
      senderEmail
      positiveFeedback
      toImprove
      comment
      createdAt
    }
  }`
  constructor(private apollo: Apollo) { }

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
