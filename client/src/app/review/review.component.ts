import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../shared/auth';
import { ReviewService } from './review.service';
import { SentimentComponent } from './sentiment/sentiment.component';
import { SentimentNote } from './sentiment/sentiment.types';
import { requiredSentimentValidator } from './sentiment/sentiment.validator';

@Component({
  selector: 'app-review',
  host: { class: 'app-review' },
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    SentimentComponent,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent {
  @ViewChild('reviewStep1') reviewStep1Tmpl!: TemplateRef<unknown>;

  private matDialog = inject(MatDialog);

  private formBuilder = inject(NonNullableFormBuilder);

  protected authService = inject(AuthService);

  protected reviewService = inject(ReviewService);

  protected form = this.formBuilder.group({
    note: this.formBuilder.control<SentimentNote>(0, [requiredSentimentValidator]),
    comment: [''],
  });

  protected get canReview() {
    return this.authService.isKnownUser$;
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();
    this.reviewService
      .setReview(this.form.value as Required<typeof this.form.value>)
      .subscribe(() => this.form.enable());
  }

  protected open() {
    this.matDialog.open(this.reviewStep1Tmpl, { width: '600px' });
  }
}
