import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, of } from 'rxjs';
import { AskFeedback } from '../types/ask-feedback.types';
import { Feedback, ReceivedFeedback, SentFeedback } from '../types/feedback.types';
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
              return false as const;
            }
          }),
          catchError(() => of(false as const)),
        )
    );
  }

  getFeedbackList(email: string, token: string) {
    return this.apollo
      .query<{ receivedFeedbacks: ReceivedFeedback[]; sentFeedbacks: SentFeedback[] }>({
        query: this.getFeedbackListQuery,
        variables: { email, token },
        fetchPolicy: 'no-cache',
      })
      .pipe(map(({ data }) => data));
    // TODO: missing catchError...
  }

  getFeedbackById(id: string, token: string) {
    return this.apollo
      .query<{ getFeedbackById: Feedback }>({
        query: this.getFeedbackByIdQuery,
        variables: { getFeedbackById: id, token },
      })
      .pipe(
        map(({ data }) => data.getFeedbackById),
        catchError(() => of(null)),
      );
  }
}
