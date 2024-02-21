import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth';
import { PostReviewDto } from './review.dto';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private authService = inject(AuthService);

  private httpClient = inject(HttpClient);

  private apiBaseUrl = environment.apiBaseUrl;

  postReview(dto: PostReviewDto) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.post<void>(`${this.apiBaseUrl}/review`, dto, { headers }),
    );
  }
}
