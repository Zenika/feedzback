import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { switchMap } from 'rxjs';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { ManagerFeedbackListComponent } from './manager-feedback-list/manager-feedback-list.component';
import { ManagerService } from './manager.service';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
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
export default class ManagerComponent {
  @HostBinding('class.app-manager') hasCss = true;

  protected managerService = inject(ManagerService);

  protected feedbackService = inject(FeedbackService);

  private formBuilder = inject(NonNullableFormBuilder);

  protected form = this.formBuilder.group({
    consultant: [],
  });

  protected feedbacks$ = this.form.controls.consultant.valueChanges.pipe(
    takeUntilDestroyed(),
    switchMap(() => this.feedbackService.getManagerConsultantFeedbacks(this.form.controls.consultant.value)),
  );
}
