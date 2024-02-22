import { Component, ViewEncapsulation, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { EmployeeService } from '../../shared/employee/employee.service';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { ManagerListViewComponent } from './manager-list-view/manager-list-view.component';
import { MANAGER_LIST_ROOT } from './manager-list.config';
import { ManagerListData } from './manager-list.types';

@Component({
  selector: 'app-manager-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ManagerListViewComponent,
  ],
  templateUrl: './manager-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerListComponent implements ManagerListData {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  protected managedEmails = inject(EmployeeService).dataSnapshot.managedEmails;

  private feedbackService = inject(FeedbackService);

  managedEmail = input<string>('');

  protected sharedFeedbackItems = toSignal(
    toObservable(this.managedEmail).pipe(
      switchMap((managedEmail) => {
        if (managedEmail === MANAGER_LIST_ROOT) {
          return of(null);
        }
        if (!this.managedEmails.includes(managedEmail)) {
          this.selectManagedEmail(MANAGER_LIST_ROOT);
          return of(null);
        }
        return this.feedbackService.getSharedFeedbackList(managedEmail);
      }),
    ),
  );

  protected selectManagedEmail(managedEmail: string) {
    this.router.navigate(['../', managedEmail], { relativeTo: this.activatedRoute });
  }
}
