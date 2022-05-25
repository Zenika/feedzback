import { Component, OnInit, Input } from '@angular/core';
import { Feedback } from '../model/feedback';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  @Input() feedbacks!: Feedback[];

  constructor() { }

  ngOnInit(): void {
  }
}
