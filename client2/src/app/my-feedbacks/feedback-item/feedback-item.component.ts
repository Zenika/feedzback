import { NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { FeedbackComponent } from 'src/app/shared/feedback/feedback.component';
import { getFeedbackType } from '../../shared/feedback/feedback.helpers';
import { FeedbackType } from '../../shared/feedback/feedback.types';

@Component({
  selector: 'app-feedback-item',
  standalone: true,
  imports: [NgIf, RouterLink, MatButtonModule, MatDialogModule, MatIconModule, FeedbackComponent],
  templateUrl: './feedback-item.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackItemComponent implements AfterViewInit {
  @Input({ required: true }) id!: string;

  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  @ViewChild('dialogTmplRef') dialogTmplRef!: TemplateRef<unknown>;

  protected feedbackType = FeedbackType;

  private dialog = inject(MatDialog);

  private router = inject(Router);

  ngAfterViewInit(): void {
    this.dialog
      .open(this.dialogTmplRef, { width: '100%' })
      .afterClosed()
      .pipe(first())
      .subscribe(() => this.router.navigate(['/feedbacks'], { queryParamsHandling: 'preserve' }));
  }
}
