import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from '../model/feedback';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  public feedback!: Feedback
  constructor(private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {
   this.feedback = new Feedback('',
   this.activateRouter.snapshot.paramMap.get('senderName')!,
   this.activateRouter.snapshot.paramMap.get('senderEmail')!,
   '',
   '',
   this.activateRouter.snapshot.paramMap.get('positiveFeedback')!,
   this.activateRouter.snapshot.paramMap.get('toImprove')!,
   this.activateRouter.snapshot.paramMap.get('comment')!,
   this.activateRouter.snapshot.paramMap.get('createdAt')!,
   )
  }

}
