import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { environment } from '../../environments/environment';
import { FeedbackStats } from './stats.types';

export const statsResolver: ResolveFn<FeedbackStats> = () =>
  inject(HttpClient).get<FeedbackStats>(`${environment.apiBaseUrl}/feedback-stats`);
