import { Component, OnInit, Input } from '@angular/core';
import { Feedback } from '../model/feedback';
import { FeedbackType } from '../enum/feedback-type';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  @Input() feedbacks!: Feedback[];
  @Input() type!: FeedbackType;
  public feedbackType: typeof FeedbackType = FeedbackType;

  constructor() { }

  ngOnInit(): void {
  }
}
