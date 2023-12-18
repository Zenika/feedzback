import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { ManagerFeedbackListComponent } from './manager-feedback-list/manager-feedback-list.component';
import { ManagerService } from './manager.service';
import { ManagerData } from './manager.types';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ManagerFeedbackListComponent,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerComponent implements ManagerData {
  @HostBinding('class.app-manager') hasCss = true;

  protected consultant$ = new BehaviorSubject<string>('');

  @Input() set consultant(value: string) {
    this.consultant$.next(value);
  }
  get consultant() {
    return this.consultant$.value;
  }

  protected router = inject(Router);

  protected activatedRoute = inject(ActivatedRoute);

  protected consultants = inject(ManagerService).consultants;

  protected feedbackService = inject(FeedbackService);

  protected feedbacks$ = this.consultant$.pipe(
    switchMap((consultant) => {
      if (this.consultants.includes(consultant)) {
        return this.feedbackService.getManagedFeedbacks(consultant);
      } else {
        return of([]);
      }
    }),
  );

  protected consultantChange(consultant: string) {
    const queryParams: ManagerData = { consultant };
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });
  }
}
