import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, TemplateRef, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { delay, first, map, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmployeeService } from '../shared/employee';

@Component({
  selector: 'app-no-manager-dialog',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './no-manager-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NoManagerDialogComponent implements AfterViewInit {
  private employeeService = inject(EmployeeService);

  private dialog = inject(MatDialog);

  private document = inject(DOCUMENT);

  templateRef = viewChild.required<TemplateRef<unknown>>('templateRef');

  private readonly delay = 60_000; // 1 minute

  private readonly expiryDuration = 604_800_000; // 7 days

  private readonly expiryDateKey = 'no-manager-dialog-expiry-date';

  ngAfterViewInit(): void {
    if (environment.firebaseEmulatorMode) {
      // Firebase emulator mode is used for e2e tests.
      // Therefore, we need to prevent the dialog from opening unexpectedly in this environment.
      return;
    }

    if (!this.shouldOpenDialog()) {
      return;
    }

    this.employeeService.data$
      .pipe(
        delay(this.delay),
        map(({ managerEmail }) => !!managerEmail),
      )
      .pipe(
        switchMap((hasManager) => {
          if (hasManager) {
            return of(false);
          }
          return this.dialog.open(this.templateRef(), { width: '500px', disableClose: true }).afterClosed();
        }),
        first(),
      )
      .subscribe(() => this.storeDialogExpiryDate());
  }

  private shouldOpenDialog() {
    return Date.now() > this.getDialogExpiryDate();
  }

  private getDialogExpiryDate() {
    const storedDate = this.document.defaultView?.localStorage.getItem(this.expiryDateKey);
    return storedDate ? Number(storedDate) : 0;
  }

  private storeDialogExpiryDate() {
    const dialogExpiryDateValue = Date.now() + this.expiryDuration;
    this.document.defaultView?.localStorage.setItem(this.expiryDateKey, dialogExpiryDateValue.toString());
  }
}
