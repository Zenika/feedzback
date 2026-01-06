import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BYPASS_AUTHORIZATION_CONTEXT } from '../auth';
import {
  FeedbackArchiveRequestDto,
  FeedbackRequestAgainDto,
  FeedbackRequestDto,
  GiveFeedbackDto,
  GiveRequestedFeedbackDto,
} from './feedback.dto';
import {
  Feedback,
  FeedbackDraft,
  FeedbackDraftType,
  FeedbackItem,
  FeedbackListMap,
  FeedbackListType,
  FeedbackRequest,
  FeedbackRequestDraft,
  FeedbackRequestDraftType,
  FeedbackRequestItem,
  IdObject,
  PreRequestResponse,
  PreRequestTokenData,
  TokenObject,
} from './feedback.types';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private httpClient = inject(HttpClient);

  private apiBaseUrl = environment.apiBaseUrl;

  // ----- Pre-request feedback -----

  preRequestToken(message: string, shared: boolean): Observable<PreRequestResponse> {
    return this.httpClient.post<PreRequestResponse>(`${this.apiBaseUrl}/feedback/pre-request/token`, {
      message,
      shared,
    });
  }

  checkPreRequest(token: string): Observable<PreRequestTokenData> {
    return this.httpClient.get<PreRequestTokenData>(`${this.apiBaseUrl}/feedback/check-pre-request/${token}`, {
      context: BYPASS_AUTHORIZATION_CONTEXT,
    });
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  preRequestEmail(token: string, giverEmail: string): Observable<void> {
    return this.httpClient.post<void>(
      `${this.apiBaseUrl}/feedback/pre-request/email`,
      { token, giverEmail },
      {
        context: BYPASS_AUTHORIZATION_CONTEXT,
        withCredentials: true,
      },
    );
  }

  // ----- Request feedback and give requested feedback -----

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  request(dto: FeedbackRequestDto): Observable<{ error: boolean; message?: 'invalid_email' }> {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/request`, dto, { withCredentials: true }).pipe(
      map(() => ({ error: false })),
      catchError(({ error }: HttpErrorResponse) => of({ error: true, message: error?.message })),
    );
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  requestAgain(feedbackId: string) {
    return this.httpClient.post<void>(
      `${this.apiBaseUrl}/feedback/request-again`,
      { feedbackId } satisfies FeedbackRequestAgainDto,
      { withCredentials: true },
    );
  }

  archiveRequest(feedbackId: string): Observable<{ error: boolean; message?: 'Forbidden' }> {
    return this.httpClient
      .post<void>(`${this.apiBaseUrl}/feedback/archive-request`, { feedbackId } satisfies FeedbackArchiveRequestDto)
      .pipe(
        map(() => ({ error: false })),
        catchError(({ error }: HttpErrorResponse) => {
          const isForbidden = (error?.message as 'Bad Request' | 'Forbidden') === 'Forbidden';
          return of({ error: true, message: isForbidden ? ('Forbidden' as const) : undefined });
        }),
      );
  }

  checkRequest(token: string) {
    return this.httpClient.get<{ request: FeedbackRequest; draft?: FeedbackRequestDraft }>(
      `${this.apiBaseUrl}/feedback/check-request/${token}`,
      { context: BYPASS_AUTHORIZATION_CONTEXT },
    );
  }

  revealRequestTokenId(feedbackId: string) {
    return this.httpClient.get<TokenObject>(`${this.apiBaseUrl}/feedback/reveal-request-token/${feedbackId}`);
  }

  giveRequestedDraft(dto: GiveRequestedFeedbackDto) {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/give-requested/draft`, dto, {
      context: BYPASS_AUTHORIZATION_CONTEXT,
    });
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  giveRequested(dto: GiveRequestedFeedbackDto) {
    return this.httpClient
      .post<void>(`${this.apiBaseUrl}/feedback/give-requested`, dto, {
        context: BYPASS_AUTHORIZATION_CONTEXT,
        withCredentials: true,
      })
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  // ----- Give spontaneous feedback -----

  // Note: use the `FeedbackDraftService` wrapper to access this method
  getDraftList() {
    return this.httpClient.get<FeedbackDraft[]>(`${this.apiBaseUrl}/feedback/give/draft`);
  }

  // Note: use the `FeedbackDraftService` wrapper to access this method
  giveDraft(dto: GiveFeedbackDto) {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/give/draft`, dto);
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  give(dto: GiveFeedbackDto): Observable<IdObject | { id: undefined; error: true; message?: 'invalid_email' }> {
    return this.httpClient.post<IdObject>(`${this.apiBaseUrl}/feedback/give`, dto, { withCredentials: true }).pipe(
      catchError(({ error }: HttpErrorResponse) =>
        of({
          id: undefined,
          error: true as const,
          message: error.message,
        }),
      ),
    );
  }

  // ----- Manage feedback draft (common tasks) -----

  // Note: use the `FeedbackDraftService` wrapper to access this method
  deleteDraft(type: FeedbackDraftType | FeedbackRequestDraftType, receiverEmailOrToken: string) {
    return this.httpClient.delete<void>(`${this.apiBaseUrl}/feedback/draft/${type}/${receiverEmailOrToken}`);
  }

  // ----- Archive feedback (with status "done") -----

  archive(feedbackId: string) {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/archive/${feedbackId}`, {});
  }

  // ----- View feedbacks (requested and given) -----

  getListMap(types: FeedbackListType[]) {
    return this.httpClient.get<FeedbackListMap>(`${this.apiBaseUrl}/feedback/list-map`, {
      params: { types: types.join() },
    });
  }

  getDocument(id: string) {
    return this.httpClient.get<Feedback | FeedbackRequest | null>(`${this.apiBaseUrl}/feedback/document/${id}`);
  }

  getSharedFeedbackList(managedEmail: string) {
    return this.httpClient.get<(FeedbackItem | FeedbackRequestItem)[]>(
      `${this.apiBaseUrl}/feedback/shared/list/${managedEmail}`,
    );
  }

  getSharedFeedbackDocument(id: string) {
    return this.httpClient.get<Feedback | FeedbackRequest>(`${this.apiBaseUrl}/feedback/shared/document/${id}`);
  }
}
