import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Feedback } from '../model/feedback';
import { FeedbackType } from '../enum/feedback-type';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  @Input() feedbacks!: Feedback[]
  @Input() type!: FeedbackType
  public current: number = 1
  public perPage = 10
  @Input() total!: number
  public feedbackType: typeof FeedbackType = FeedbackType;
  public feedbacksToDisplay!: Feedback[] 

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.feedbacksToDisplay = this.paginate(this.current, this.perPage)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['feedbacks'])
    this.feedbacksToDisplay = this.paginate(this.current, this.perPage)
  }

  public onGoTo(page: number): void {
    this.current = page
    this.feedbacksToDisplay = this.paginate(this.current, this.perPage)
  }
  public onNext(page: number): void {
    this.current= page +1
    this.feedbacksToDisplay = this.paginate(this.current, this.perPage)
  }
  public onPrevious(page: number){
    this.current = page -1
    this.feedbacksToDisplay = this.paginate(this.current, this.perPage)
  }
  public paginate(current: number, perPage: number): Feedback[] {
    return [...this.feedbacks.slice((current -1) * perPage).slice(0, perPage)]
  }
}
