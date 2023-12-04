import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { AskFeedbackDto, SendAskedFeedbackDto, SendFeedbackDto } from './feedback.dto';
import { AskedFeedback, Feedback, FeedbackIdObj, TypedFeedbacks } from './feedback.types';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  ask(dto: AskFeedbackDto) {
    return this.httpClient
      .post<boolean>(`${this.apiBaseUrl}/feedback/ask`, dto, { headers: this.authorizationHeader })
      .pipe(catchError(() => of(false)));
  }

  checkAsked(id: string) {
    return this.httpClient.get<AskedFeedback>(`${this.apiBaseUrl}/feedback/asked/${id}`);
  }

  sendAsked(dto: SendAskedFeedbackDto) {
    return this.httpClient
      .post<boolean>(`${this.apiBaseUrl}/feedback/send-asked`, dto)
      .pipe(catchError(() => of(false)));
  }

  send(dto: SendFeedbackDto) {
    return this.httpClient.post<Partial<FeedbackIdObj>>(`${this.apiBaseUrl}/feedback/send`, dto, {
      headers: this.authorizationHeader,
    });
  }

  getList() {
    return this.httpClient.get<TypedFeedbacks>(`${this.apiBaseUrl}/feedback/list`, {
      headers: this.authorizationHeader,
    });
  }

  getItem(id: string) {
    return this.httpClient.get<Feedback | AskedFeedback | null>(`${this.apiBaseUrl}/feedback/item/${id}`, {
      headers: this.authorizationHeader,
    });
  }

  get authorizationHeader() {
    return { Authorization: `Bearer ${this.authService.idToken}` };
  }
}
