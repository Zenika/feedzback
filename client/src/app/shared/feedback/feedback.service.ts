import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
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
  TokenObject,
} from './feedback.types';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  // ----- Request feedback and give requested feedback -----

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  request(dto: FeedbackRequestDto): Observable<{ error: boolean; message?: 'invalid_email' }> {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/request`, dto, { headers, withCredentials: true }).pipe(
        map(() => ({ error: false })),
        catchError(({ error }: HttpErrorResponse) => of({ error: true, message: error?.message })),
      ),
    );
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  requestAgain(feedbackId: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<void>(
        `${this.apiBaseUrl}/feedback/request-again`,
        { feedbackId } satisfies FeedbackRequestAgainDto,
        { headers, withCredentials: true },
      ),
    );
  }

  archiveRequest(feedbackId: string): Observable<{ error: boolean; message?: 'Forbidden' }> {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient
        .post<void>(`${this.apiBaseUrl}/feedback/archive-request`, { feedbackId } satisfies FeedbackArchiveRequestDto, {
          headers,
        })
        .pipe(
          map(() => ({ error: false })),
          catchError(({ error }: HttpErrorResponse) => {
            const isForbidden = (error?.message as 'Bad Request' | 'Forbidden') === 'Forbidden';
            return of({ error: true, message: isForbidden ? ('Forbidden' as const) : undefined });
          }),
        ),
    );
  }

  checkRequest(token: string) {
    return this.httpClient.get<{ request: FeedbackRequest; draft?: FeedbackRequestDraft }>(
      `${this.apiBaseUrl}/feedback/check-request/${token}`,
    );
  }

  revealRequestTokenId(feedbackId: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<TokenObject>(`${this.apiBaseUrl}/feedback/reveal-request-token/${feedbackId}`, { headers }),
    );
  }

  giveRequestedDraft(dto: GiveRequestedFeedbackDto) {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/give-requested/draft`, dto);
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  giveRequested(dto: GiveRequestedFeedbackDto) {
    return this.httpClient
      .post<void>(`${this.apiBaseUrl}/feedback/give-requested`, dto, { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  // ----- Give spontaneous feedback -----

  // Note: use the `FeedbackDraftService` wrapper to access this method
  getDraftList() {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<FeedbackDraft[]>(`${this.apiBaseUrl}/feedback/give/draft`, { headers }),
    );
  }

  // Note: use the `FeedbackDraftService` wrapper to access this method
  giveDraft(dto: GiveFeedbackDto) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/give/draft`, dto, { headers }),
    );
  }

  // The cookie `app-locale-id` must be provided (using the `withCredentials` option)
  // so that the server can determine the language to be used in the emails.
  give(dto: GiveFeedbackDto): Observable<IdObject | { id: undefined; error: true; message?: 'invalid_email' }> {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<IdObject>(`${this.apiBaseUrl}/feedback/give`, dto, { headers, withCredentials: true }).pipe(
        catchError(({ error }: HttpErrorResponse) =>
          of({
            id: undefined,
            error: true as const,
            message: error.message,
          }),
        ),
      ),
    );
  }

  // ----- Manage feedback draft (common tasks) -----

  // Note: use the `FeedbackDraftService` wrapper to access this method
  deleteDraft(type: FeedbackDraftType | FeedbackRequestDraftType, receiverEmailOrToken: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.delete<void>(`${this.apiBaseUrl}/feedback/draft/${type}/${receiverEmailOrToken}`, { headers }),
    );
  }

  // ----- Archive feedback (with status "done") -----

  archive(feedbackId: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/archive/${feedbackId}`, {}, { headers }),
    );
  }

  // ----- View feedbacks (requested and given) -----

  getListMap(types: FeedbackListType[]) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<FeedbackListMap>(`${this.apiBaseUrl}/feedback/list-map`, {
        headers,
        params: { types: types.join() },
      }),
    );
  }

  getDocument(id: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<Feedback | FeedbackRequest | null>(`${this.apiBaseUrl}/feedback/document/${id}`, { headers }),
    );
  }

  getSharedFeedbackList(managedEmail: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<(FeedbackItem | FeedbackRequestItem)[]>(
        `${this.apiBaseUrl}/feedback/shared/list/${managedEmail}`,
        { headers },
      ),
    );
  }

  getSharedFeedbackDocument(id: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<Feedback | FeedbackRequest>(`${this.apiBaseUrl}/feedback/shared/document/${id}`, {
        headers,
      }),
    );
  }
}
