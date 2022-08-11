import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { Feedback } from '../model/feedback';
import { FeedbackType } from '../enum/feedback-type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css'],
})
export class FeedbackListComponent implements OnInit, AfterContentChecked {
  @Input() feedbacks!: Feedback[];
  @Input() type!: FeedbackType;
  public feedbackType: typeof FeedbackType = FeedbackType;
  sortedFeedbackList!: Feedback[];
  datePipe!: DatePipe;

  ngOnInit(): void {
    this.datePipe = new DatePipe('en-US');
  }

  ngAfterContentChecked(): void {
    this.sortFeedbackList();
  }

  sortFeedbackList() {
    this.sortedFeedbackList = [...this.feedbacks];
    this.sortedFeedbackList.sort(
      (a, b) =>
        new Date(
          this.datePipe.transform(b.createdAt, 'yyyy-MM-dd')!
        ).getTime() -
        new Date(this.datePipe.transform(a.createdAt, 'yyyy-MM-dd')!).getTime()
    );
  }
}
