import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Subject } from 'rxjs';
import { Feedback } from 'src/app/model/feedback';
import { FeedbackQueryData } from 'src/app/model/feedbackQueryData';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

 private sendFeedBackMutation = gql`
  mutation SendFeedback($feedbackInput: FeedbackInput!){
    sendFeedback(feedbackInput:$feedbackInput)
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
  constructor(private apollo: Apollo, private router: Router) { }
   
  sendFeedback(feedback: FeedbackQueryData) {
    const token = sessionStorage.getItem('token');
    this.apollo.mutate({
      mutation: this.sendFeedBackMutation,
      variables: {
        feedbackInput: feedback,
      },
    }).subscribe((data: any) => {
      let result = data.data.sendFeedback;
      if (result === "sent") {
        result = "Félicitations! Votre feedback vient d’être envoyée à : " + feedback.receverName;
        this.router.navigate(['/result', { result: 'success', message: result }])
      } else {
        result = "Désolé ! Votre feedback n’a pas été envoyée à cause d’un problème technique...  Veuillez réessayer."
        this.router.navigate(['/result', { result: 'sendFailed', message: result }])
      }
    })
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
