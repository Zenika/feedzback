import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
import { SetReviewDto } from './review.dto';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  setReview(dto: SetReviewDto) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/review`, dto, { headers }),
    );
  }
}
