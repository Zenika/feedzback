import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { FeedbackRequestDto, GiveFeedbackDto, GiveRequestedFeedbackDto } from './feedback.dto';
import {
  Feedback,
  FeedbackDraftData,
  FeedbackListMap,
  FeedbackRequest,
  FeedbackRequestDraft,
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

  request(dto: FeedbackRequestDto) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/request`, dto, { headers }).pipe(
        map(() => true),
        catchError(() => of(false)),
      ),
    );
  }

  checkRequest(token: string) {
    return this.httpClient.get<{ request: FeedbackRequest; draft?: FeedbackRequestDraft }>(
      `${this.apiBaseUrl}/feedback/check-request/${token}`,
    );
  }

  revealRequestTokenId(feedbackId: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<TokenObject>(`${this.apiBaseUrl}/feedback/reveal-request-token/${feedbackId}`, { headers }),
    );
  }

  giveRequestedDraft(dto: GiveRequestedFeedbackDto) {
    return this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/give-requested/draft`, dto);
  }

  giveRequested(dto: GiveRequestedFeedbackDto) {
    return this.httpClient
      .post<boolean>(`${this.apiBaseUrl}/feedback/give-requested`, dto)
      .pipe(catchError(() => of(false)));
  }

  getDraftDataList() {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<FeedbackDraftData[]>(`${this.apiBaseUrl}/feedback/give/draft`, { headers }),
    );
  }

  giveDraft(dto: GiveFeedbackDto) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/feedback/give/draft`, dto, { headers }),
    );
  }

  give(dto: GiveFeedbackDto): Observable<Partial<IdObject>> {
    return this.authService.withBearerToken((headers) =>
      this.httpClient
        .post<IdObject>(`${this.apiBaseUrl}/feedback/give`, dto, { headers })
        .pipe(catchError(() => of({ id: undefined } as Partial<IdObject>))),
    );
  }

  getListMap() {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<FeedbackListMap>(`${this.apiBaseUrl}/feedback/list-map`, { headers }),
    );
  }

  getDocument(id: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<Feedback | FeedbackRequest | null>(`${this.apiBaseUrl}/feedback/document/${id}`, { headers }),
    );
  }

  getManagedFeedbacks(managedEmail: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<Feedback[]>(`${this.apiBaseUrl}/feedback/managed/${managedEmail}`, {
        headers,
      }),
    );
  }
}
