import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-feedback-result',
  templateUrl: './send-feedback-result.component.html',
  styleUrls: ['./send-feedback-result.component.css']
})
export class SendFeedbackResultComponent implements OnInit {

  result!: string
  constructor(private route: ActivatedRoute) {
    this.result = this.route.snapshot.paramMap.get('result')!
   }
  ngOnInit(): void {
  }

}
