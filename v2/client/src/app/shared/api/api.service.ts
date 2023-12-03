import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AskFeedback } from '../types/ask-feedback.types';
import { AskedFeedback, CheckAskedFeedback } from '../types/asked-feedback.types';
import { Feedback, ReceivedFeedback, SentFeedback } from '../types/feedback.types';
import { SendFeedback } from '../types/send-feedback.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  askFeedback(askFeedback: AskFeedback): Observable<boolean> {
    console.log(askFeedback);
    return of(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkAskedFeedback({ receiverEmail, recipientToken }: CheckAskedFeedback): Observable<AskedFeedback | null> {
    return of({ recipient: 'john.doe@gmail.com' });
  }

  sendAskedFeedback(sendFeedback: SendFeedback, recipientToken: string): Observable<boolean> {
    console.log(sendFeedback, recipientToken);
    return of(true);
  }

  sendFeedback(sendFeedback: SendFeedback): Observable<string | false> {
    console.log(sendFeedback);
    return of(false);

    return this.httpClient.post<string | false>('http://localhost:3000/feedzback/send', sendFeedback, {
      headers: this.authorizationHeader,
    });
  }

  getFeedbackList(): Observable<{ receivedFeedbacks: ReceivedFeedback[]; sentFeedbacks: SentFeedback[] }> {
    return this.httpClient.get<{ receivedFeedbacks: ReceivedFeedback[]; sentFeedbacks: SentFeedback[] }>(
      'http://localhost:3000/feedzback/list',
      { headers: this.authorizationHeader },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFeedbackById(id: string): Observable<Feedback | null> {
    return of(null);
  }

  get authorizationHeader() {
    return { Authorization: `Bearer ${this.authService.idToken}` };
  }
}
