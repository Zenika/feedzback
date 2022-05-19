import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-send-feedback-result',
  templateUrl: './send-ask-feedback-result.component.html',
  styleUrls: ['./send-ask-feedback-result.component.css']
})
export class SendAskFeedbackResultComponent implements OnInit {

  result!: string
  constructor(private route: ActivatedRoute, private router: Router, private location: Location) {
    this.result = this.route.snapshot.paramMap.get('result')!

    if (!this.result)
      this.router.navigate(['/'])
  }

  ngOnInit(): void {
  }

  public onRetryClick() {
    this.location.back()
  }

  public onReturnClick() {
    this.router.navigate(['/'])
  }
}
