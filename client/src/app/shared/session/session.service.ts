import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { first, of, switchMap } from 'rxjs';
import { AuthService } from '../auth';
import { SessionIdleService } from './session-idle.service';
import { SessionWarningComponent } from './session-warning/session-warning.component';
import { SESSION_CONFIG } from './session.constants';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private idleService = inject(SessionIdleService);

  private authService = inject(AuthService);

  private destroyRef = inject(DestroyRef);

  private snackBar = inject(MatSnackBar);

  private snackBarRef?: MatSnackBarRef<SessionWarningComponent>;

  private readonly config = SESSION_CONFIG;

  /**
   * Determine whether the idle time has been exceeded when the page is loaded.
   * If it is the case, trigger a `signOut`.
   */
  checkIdleOnLoad() {
    return this.authService.authenticated$.pipe(
      first(),
      switchMap((authenticated) => {
        const activityDate = this.idleService.getActivityDate();

        if (!authenticated || activityDate === undefined) {
          return of(null);
        }

        const idleDelay = (Date.now() - activityDate) / 1000;
        if (idleDelay > this.config.idle) {
          return this.authService.signOut();
        }

        return of(null);
      }),
    );
  }

  startIdleEventHandling() {
    this.idleService.events$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      switch (event) {
        case 'idleWarning': {
          this.openWarning();
          break;
        }
        case 'noIdleWarning': {
          this.closeWarning();
          break;
        }
        case 'idle': {
          this.closeWarning();
          this.signOut();
          break;
        }
      }
    });
  }

  private openWarning() {
    this.snackBarRef?.dismiss(); // Dismiss any existing snackbar.
    this.snackBarRef = this.snackBar.openFromComponent(SessionWarningComponent, {
      panelClass: 'app-session-warning-panel',
    });
  }

  private closeWarning() {
    if (!this.snackBarRef) {
      return;
    }
    this.snackBarRef.dismiss();
    this.snackBarRef = undefined;
  }

  private signOut() {
    this.authService.signOut().subscribe();
  }
}
