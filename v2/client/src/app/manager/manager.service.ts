import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { FeedbackService } from '../shared/feedback/feedback.service';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  isManager = false;

  consultants: string[] = [];

  private feedbackService = inject(FeedbackService);

  init() {
    return this.feedbackService.getManagerConsultants().pipe(
      tap((consultants) => {
        this.isManager = !!consultants;
        this.consultants = consultants ?? [];
      }),
    );
  }
}
