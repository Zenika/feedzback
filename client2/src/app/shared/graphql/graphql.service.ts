import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, of } from 'rxjs';
import { AskFeedback } from '../types/ask-feedback.types';
import { Feedback } from '../types/feedback.types';
import { SendFeedback } from '../types/send-feedback.types';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  private apollo = inject(Apollo);

  private askFeedbackMutation = gql`
    mutation AskFeedback($askFeedback: AskFeedback!) {
      sendFeedbackRequest(askFeedback: $askFeedback)
    }
  `;

  private sendFeedBackMutation = gql`
    mutation SendFeedback($feedbackInput: FeedbackInput!) {
      sendFeedback(feedbackInput: $feedbackInput) {
        feedbackId
        message
      }
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

  askFeedback(feedback: AskFeedback) {
    // !FIXME: i don't know the value when request fails...
    return this.apollo
      .mutate<{ sendFeedbackRequest?: 'sent' }>({
        mutation: this.askFeedbackMutation,
        variables: { askFeedback: feedback },
      })
      .pipe(
        map(({ data }) => data?.sendFeedbackRequest === 'sent'),
        catchError(() => of(false)),
      );
  }

  sendFeedback(feedback: SendFeedback) {
    // !FIXME: the response API is strange...
    return (
      this.apollo
        // TODO: the mutate<TYPE> must be confirmed and improved...
        // TODO: i'm not sure of the feedbackId type (string or number...?). Let say string for now...
        .mutate<{ sendFeedback?: { message: 'sent'; feedbackId: string } | { message: undefined } }>({
          mutation: this.sendFeedBackMutation,
          variables: { feedbackInput: feedback },
        })
        .pipe(
          map(({ data }) => {
            if (data?.sendFeedback?.message === 'sent') {
              return data?.sendFeedback.feedbackId;
            } else {
              return false;
            }
          }),
          catchError(() => of(false)),
        )
    );
  }

  getFeedbackList(email: string): Observable<Feedback[]> {
    return this.apollo
      .watchQuery<Feedback[]>({
        query: this.getFeedbackListQuery,
        variables: { email },
        pollInterval: 4500,
      })
      .valueChanges.pipe(map(({ data }) => data));
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
