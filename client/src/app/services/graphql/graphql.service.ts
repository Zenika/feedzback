import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Subject } from 'rxjs';
import { Feedback } from 'src/app/model/feedback';
import { FeedbackRequest } from 'src/app/model/feedbackRequest';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  private askFeedbackMutation = gql`
  mutation AskFeedback($askFeedback: AskFeedback!) {
    sendFeedbackRequest(askFeedback: $askFeedback)
  }
  `
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
  constructor(private apollo: Apollo,private router: Router) { }

  askFeedback(feedback: FeedbackRequest) {
    this.apollo.mutate({
      mutation: this.askFeedbackMutation,
      variables: {
        askFeedback: feedback
      },
    }).subscribe((data: any) => {
      let result = data.data.sendFeedbackRequest;
      if (result === 'sent') {
        result = "Félicitations! Votre demande vient d’être envoyée à : " + feedback.senderName;
        this.router.navigate(['/result', { result: 'success' ,message:result}])
      } else {
        result = "Désolé ! Votre demande n’a pas été envoyée à cause d’un problème technique...  Veuillez réessayer."
        this.router.navigate(['/result', { result: 'askFailed', message: result }])
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
