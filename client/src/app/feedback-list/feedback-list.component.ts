import { Component, OnInit, Input } from '@angular/core';
import { Feedback } from '../model/feedback';
import { FeedbackType } from '../enum/feedback-type';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  @Input() feedbacks!: Feedback[];
  @Input() type!: FeedbackType;
  public feedbackType: typeof FeedbackType = FeedbackType;
  sortedFeedbackList!: Feedback[]
 

  constructor(private router:Router) { }

  ngOnInit(): void {
    const arr1 = [
      { id: 3, date: new Date('2022-04-21') },
      { id: 5, date: new Date('2027-04-21') },
      { id: 2, date: new Date('2023-01-21') },
    ];
    
    // ✅ Sort in Ascending order (low to high)
    const sortedAsc = arr1.sort(
      (objA, objB) => {
        console.log(objA.date.getTime() + ' and  ' + objB.date.getTime() )
        console.log(objA.date.getTime() - objB.date.getTime())
        return objA.date.getTime() - objB.date.getTime()
      } 
    );
    console.log(sortedAsc);
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    const datePipe = new DatePipe("en-US")
  this.sortedFeedbackList = [...this.feedbacks]

     this.sortedFeedbackList.sort((a, b) => new Date(datePipe.transform(b.createdAt, 'yyyy-MM-dd')!).getTime() - new Date(datePipe.transform(a.createdAt, 'yyyy-MM-dd')!).getTime())
   //  console.log(this.sortedFeedbackList)

  }
}
