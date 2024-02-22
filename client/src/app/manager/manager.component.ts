import { Component, ViewEncapsulation, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { EmployeeService } from '../shared/employee/employee.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { ManagerFeedbackListComponent } from './manager-feedback-list/manager-feedback-list.component';
import { ManagerData } from './manager.types';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ManagerFeedbackListComponent,
  ],
  templateUrl: './manager.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerComponent implements ManagerData {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  protected managedEmails = inject(EmployeeService).dataSnapshot.managedEmails;

  private feedbackService = inject(FeedbackService);

  employee = input<string>('');

  protected employeeItems = toSignal(
    toObservable(this.employee).pipe(
      switchMap((employee) => {
        if (!this.managedEmails.includes(employee)) {
          return of(null);
        }
        return this.feedbackService.getManagedFeedbackList(employee);
      }),
    ),
  );

  protected employeeChange(employee: string) {
    const queryParams: ManagerData = { employee };
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });
  }
}
