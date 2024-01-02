import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { EmployeeService } from '../shared/employee/employee.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { ManagerFeedbackListComponent } from './manager-feedback-list/manager-feedback-list.component';
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
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerComponent implements ManagerData {
  @HostBinding('class.app-manager') hasCss = true;

  protected employee$ = new BehaviorSubject<string>('');

  @Input() set employee(value: string) {
    this.employee$.next(value);
  }
  get employee() {
    return this.employee$.value;
  }

  protected router = inject(Router);

  protected activatedRoute = inject(ActivatedRoute);

  protected employees = inject(EmployeeService).dataSnapshot.managedEmails;

  protected feedbackService = inject(FeedbackService);

  protected feedbacks$ = this.employee$.pipe(
    switchMap((employee) => {
      if (this.employees.includes(employee)) {
        return this.feedbackService.getManagedFeedbacks(employee);
      } else {
        return of(null);
      }
    }),
  );

  protected employeeChange(employee: string) {
    const queryParams: ManagerData = { employee };
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });
  }
}
