import { NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { FeedbackComponent } from 'src/app/shared/feedback/feedback.component';
import { getFeedbackType } from '../../shared/feedback/feedback.helpers';
import { FeedbackType } from '../../shared/feedback/feedback.types';

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [NgIf, RouterLink, MatButtonModule, MatDialogModule, MatIconModule, FeedbackComponent],
  templateUrl: './feedback-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDialogComponent implements AfterViewInit {
  @ViewChild('dialogTmplRef') dialogTmplRef!: TemplateRef<unknown>;

  @Input({ required: true }) id!: string;

  protected type?: FeedbackType;

  protected feedbackType = FeedbackType;

  private dialog = inject(MatDialog);

  private activatedRoute = inject(ActivatedRoute);

  private router = inject(Router);

  private get typeFromParentRoute() {
    return getFeedbackType(this.activatedRoute.parent?.snapshot.params['type']);
  }

  ngAfterViewInit(): void {
    this.type = this.typeFromParentRoute;
    if (!this.type) {
      return;
    }

    this.openDialog();
  }

  private openDialog() {
    if (this.dialog.openDialogs.length) {
      return;
    }
    this.dialog
      .open(this.dialogTmplRef, { width: '100%' })
      .afterClosed()
      .pipe(first())
      .subscribe(() => this.router.navigate(['../'], { relativeTo: this.activatedRoute }));
  }
}
