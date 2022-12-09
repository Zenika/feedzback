import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FeedbackType } from '../enum/feedback-type';
import { AskFeedback } from '../model/askFeedback';
import { FeedbackRequest } from '../model/feedbackRequest';

@Component({
  selector: 'app-ask-feedback-list',
  templateUrl: './ask-feedback-list.component.html',
  styleUrls: ['./ask-feedback-list.component.css']
})
export class AskFeedbackListComponent implements OnInit {
  @Input() askFeedbacks!: AskFeedback[];
  @Input() type!: FeedbackType;
  public feedbackType: typeof FeedbackType = FeedbackType;
  sortedAskFeedbackList!: AskFeedback[];
  datePipe!: DatePipe;

  constructor() { }

   ngOnInit(): void {
    this.datePipe = new DatePipe('en-US');
  }

  ngAfterContentChecked(): void {
    this.sortAskFeedbackList();
  }

  sortAskFeedbackList() {
    this.sortedAskFeedbackList = [...this.askFeedbacks];
    this.sortedAskFeedbackList.sort(
        (a, b) =>
          new Date(
          this.datePipe.transform(b.createdAt, 'yyyy-MM-dd')!,
          ).getTime() -
        new Date(this.datePipe.transform(a.createdAt, 'yyyy-MM-dd')!).getTime(),
    );
  }

}
