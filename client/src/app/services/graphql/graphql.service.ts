import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Apollo, gql} from 'apollo-angular';
import {Subject, map, takeUntil} from 'rxjs';
import {Feedback} from 'src/app/model/feedback';
import {SendFeedback} from 'src/app/model/sendFeedback';
import {FeedbackRequest} from 'src/app/model/feedbackRequest';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  loading: Subject<boolean> = new Subject;
  private sendFeedBackMutation = gql`
    mutation SendFeedback($feedbackInput: FeedbackInput!) {
      sendFeedback(feedbackInput: $feedbackInput) {
        feedbackId
        message
      }
    }
  `;

  private askFeedbackMutation = gql`
    mutation AskFeedback($askFeedback: AskFeedback!) {
      sendFeedbackRequest(askFeedback: $askFeedback)
    }
  `;

  private unsubscribe$: Subject<void> = new Subject();

  private getFeedbackListQuery = gql`
    query GetFeedbacks($email: String!, $token: String!) {
      receivedFeedbacks(email: $email, token: $token) {
        id
        senderEmail
        senderName
        positiveFeedback
        toImprove
        comment
        createdAt
      }
      sentFeedbacks(email: $email, token: $token) {
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
    query GetFeedbackById($getFeedbackById: String!, $token: String!) {
      getFeedbackById(id: $getFeedbackById, token: $token) {
        senderName
        senderEmail
        receverEmail
        receverName
        positiveFeedback
        toImprove
        comment
        createdAt
      }
    }
  `;

  constructor(private apollo: Apollo, private router: Router) {}

  sendFeedback(feedback: SendFeedback) {
    this.apollo
        .mutate({
          mutation: this.sendFeedBackMutation,
          variables: {
            feedbackInput: feedback,
          },
          useMutationLoading: true,
        })
        .subscribe(({data, loading}: any) => {
          if (loading) {
            this.loading.next(true);
            return;
          } else {
            this.loading.next(false);
          }
          const result = data.sendFeedback;
          let message = result.message;
          if (message === 'sent') {
            const feedbackId = result.feedbackId;
            message =
            'Félicitations! Votre feedback vient d’être envoyée à : ' +
            feedback.receverName;
            this.router.navigate([
              '/result',
              {result: 'success', message, id: feedbackId},
            ]);
          } else {
            message =
            'Désolé ! Votre feedback n’a pas été envoyée à cause d’un problème technique...  Veuillez réessayer.';
            this.router.navigate(['/result', {result: 'sendFailed', message}]);
          }
        });
  }

  askFeedback(feedback: FeedbackRequest) {
    this.apollo
        .mutate({
          mutation: this.askFeedbackMutation,
          variables: {
            askFeedback: feedback,
          },
          useMutationLoading: true,
        })
        .subscribe(({data, loading}: any) => {
          if (loading) {
            this.loading.next(true);
            return;
          } else {
            this.loading.next(false);
          }
          let result = data.sendFeedbackRequest;
          if (result === 'sent') {
            result =
            'Félicitations ! Votre demande vient d’être envoyée';
            this.router.navigate([
              '/result',
              {result: 'success', message: result},
            ]);
          } else {
            result =
            'Désolé ! Votre demande n’a pas été envoyée à cause d’un problème technique...  Veuillez réessayer.';
            this.router.navigate([
              '/result',
              {result: 'askFailed', message: result},
            ]);
          }
        });
  }

  getFeedbackList({email, token}: {email: string, token: string}) {
    const subjectList = new Subject<Feedback[]>();
    this.apollo
        .watchQuery({
          query: this.getFeedbackListQuery,
          variables: {
            email,
            token,
          },
          pollInterval: 4500,
        })
        .valueChanges.pipe(
            map(({data}) => data),
            takeUntil(this.unsubscribe$),
        )
        .subscribe((feedbacks: any) => {
          subjectList.next(feedbacks);
        });
    return subjectList.asObservable();
  }

  getFeedbackById({id, token}: {id: string, token: string}) {
    const subject = new Subject<Feedback>();

    this.apollo
        .query({
          query: this.getFeedbackByIdQuery,
          variables: {
            getFeedbackById: id,
            token,
          },
        })
        .subscribe((result: any) => {
          subject.next(result.data.getFeedbackById);
        });
    return subject.asObservable();
  }
}
