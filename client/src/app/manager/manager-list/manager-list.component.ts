import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../shared/employee/employee.service';
import { FeedbackListComponent } from '../../shared/feedback/feedback-list/feedback-list.component';
import { FeedbackItem, FeedbackRequestItem } from '../../shared/feedback/feedback.types';
import { normalizeReceivedList, normalizeSentRequestList } from '../../shared/feedback/feedback.utils';
import { MANAGER_LIST_ROOT } from './manager-list.config';
import { ManagerListData } from './manager-list.types';

@Component({
  selector: 'app-manager-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatIconModule, MatSelectModule, FeedbackListComponent],
  templateUrl: './manager-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerListComponent implements ManagerListData {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  protected managedEmails = inject(EmployeeService).data().managedEmails;

  protected readonly root = MANAGER_LIST_ROOT;

  managedEmail = input<string>(MANAGER_LIST_ROOT);

  list = input<(FeedbackItem | FeedbackRequestItem)[]>([]);

  normalizedList = computed(() =>
    this.list().map((item) =>
      item.status === 'done' ? normalizeReceivedList([item])[0] : normalizeSentRequestList([item])[0],
    ),
  );

  protected selectManagedEmail(managedEmail: string) {
    this.router.navigate(['../', managedEmail], { relativeTo: this.activatedRoute });
  }
}
