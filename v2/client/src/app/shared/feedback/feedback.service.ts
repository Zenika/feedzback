import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { AskFeedbackDto, SendAskedFeedbackDto, SendFeedbackDto } from './feedback.dto';
import { AskedFeedback, Feedback, FeedbackIdObj, TokenIdObj, TypedFeedbacks } from './feedback.types';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  ask(dto: AskFeedbackDto) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient
        .post<boolean>(`${this.apiBaseUrl}/feedback/ask`, dto, { headers })
        .pipe(catchError(() => of(false))),
    );
  }

  checkAsked(token: string) {
    return this.httpClient.get<AskedFeedback>(`${this.apiBaseUrl}/feedback/asked/${token}`);
  }

  revealTokenId(feedbackId: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<TokenIdObj>(`${this.apiBaseUrl}/feedback/reveal-token/${feedbackId}`, { headers }),
    );
  }

  sendAsked(dto: SendAskedFeedbackDto) {
    return this.httpClient
      .post<boolean>(`${this.apiBaseUrl}/feedback/send-asked`, dto)
      .pipe(catchError(() => of(false)));
  }

  send(dto: SendFeedbackDto) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.post<Partial<FeedbackIdObj>>(`${this.apiBaseUrl}/feedback/send`, dto, { headers }),
    );
  }

  getList() {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<TypedFeedbacks>(`${this.apiBaseUrl}/feedback/list`, { headers }),
    );
  }

  getItem(id: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<Feedback | AskedFeedback | null>(`${this.apiBaseUrl}/feedback/item/${id}`, { headers }),
    );
  }
}
