import { Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { SentimentComponent, SentimentNote, requiredSentimentValidator } from '../shared/ui/sentiment';
import { ReviewPopupComponent } from './review-popup/review-popup.component';
import { ReviewService } from './review.service';
import { AllReviewStats } from './review.types';

@Component({
  selector: 'app-review',
  host: {
    class: 'app-review',
    '[class.app-review--completed]': 'completed()',
  },
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    SentimentComponent,
    ReviewPopupComponent,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);

  protected reviewService = inject(ReviewService);

  protected reviewStats = signal<AllReviewStats | undefined>(undefined);

  protected hasRelevantNumberOfReviews = computed(() => {
    const reviewStats = this.reviewStats();
    return (reviewStats && reviewStats.numberOfReviews > 10) || !environment.production;
  });

  protected completed = signal(false);

  protected readonly commentMaxLength = 500;

  protected form = this.formBuilder.group({
    note: this.formBuilder.control<SentimentNote>(0, [requiredSentimentValidator]),
    comment: ['', [Validators.maxLength(this.commentMaxLength)]],
  });

  ngOnInit(): void {
    this.form.disable();
    this.reviewService.getLastReview().subscribe((review) => {
      if (review) {
        const { note, comment } = review;
        this.form.setValue({ note, comment });
        this.form.updateValueAndValidity();
      }
      this.form.enable();
    });
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();

    this.reviewService
      .postReview(this.form.value as Required<typeof this.form.value>)
      .pipe(switchMap(() => this.reviewService.getStats()))
      .subscribe((reviewStats) => {
        this.reviewStats.set(reviewStats);
        this.completed.set(true);
      });
  }

  protected modifyReview() {
    this.form.enable();
    this.completed.set(false);
  }
}
