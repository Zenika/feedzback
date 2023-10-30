import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { AskFeedback } from '../types/ask-feedback.types';
import { Feedback } from '../types/feedback.types';
import { SendFeedback } from '../types/send-feedback.types';

// !FIXME: service should not subscribe but return an observable
// !FIXME: service should not handle messages and routing

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  private apollo = inject(Apollo);

  private router = inject(Router);

  loading = new Subject<boolean>(); // !FIXME: remove this and just return an observable in the methods

  private unsubscribe$ = new Subject<void>();

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

  private getFeedbackListQuery = gql`
    query GetFeedbacks($email: String!) {
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
    }
  `;

  sendFeedback(feedback: SendFeedback) {
    // !FIXME: should not subscribe but return an observable
    this.apollo
      .mutate({
        mutation: this.sendFeedBackMutation,
        variables: { feedbackInput: feedback },
        useMutationLoading: true,
      })
      .subscribe(({ data, loading }) => {
        if (loading) {
          this.loading.next(true);
        } else {
          this.loading.next(false);
        }
        const result = (data as any).sendFeedback;
        let message = result.message;
        if (message === 'sent') {
          const feedbackId = result.feedbackId;
          message = 'Félicitations! Votre feedback vient d’être envoyée à : ' + feedback.receverName;
          this.router.navigate(['/result', { result: 'success', message, id: feedbackId }]);
        } else {
          message =
            'Désolé ! Votre feedback n’a pas été envoyée à cause d’un problème technique...  Veuillez réessayer.';
          this.router.navigate(['/result', { result: 'sendFailed', message }]);
        }
      });
  }

  askFeedback(feedback: AskFeedback) {
    return this.apollo.mutate<{ sendFeedbackRequest: 'sent' | any }>({
      // !FIXME: i don't know the value when request fails...
      mutation: this.askFeedbackMutation,
      variables: { askFeedback: feedback },
    });
  }

  getFeedbackList(email: string): Observable<Feedback[]> {
    return this.apollo
      .watchQuery<Feedback[]>({
        query: this.getFeedbackListQuery,
        variables: { email },
        pollInterval: 4500,
      })
      .valueChanges.pipe(
        map(({ data }) => data),
        takeUntil(this.unsubscribe$),
      );
  }

  getFeedbackById(id: string): Observable<Feedback> {
    return this.apollo
      .query<{ getFeedbackById: Feedback }>({
        query: this.getFeedbackByIdQuery,
        variables: { getFeedbackByIdId: id }, // !FIXME: bad naming `IdId`
      })
      .pipe(map((result) => result.data.getFeedbackById));
  }
}
