import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFormControlError } from '../get-form-control-error';

@Component({
  selector: 'app-send-feedback-form',
  templateUrl: './send-feedback-form.component.html',
  styleUrls: ['./send-feedback-form.component.css']
})
export class SendFeedbackFormComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  private feedbackMaxLength = 500;
  private queryParams = this.activatedRoute.snapshot.queryParamMap;

  public getFormControlError = getFormControlError

  public form = new FormGroup({
    senderEmail: new FormControl(this.queryParams.get('senderEmail'), [Validators.required, Validators.email]),
    senderName: new FormControl(this.queryParams.get('senderName')),
    receverEmail: new FormControl(this.queryParams.get('receverEmail'), [Validators.required, Validators.email]),
    receverName: new FormControl(this.queryParams.get('receverName')),
    postitiveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.feedbackMaxLength)]),
    toImproveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.feedbackMaxLength)]),
    comment: new FormControl(''),
  });

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("valid")
    }
  }

  get senderEmail() { return this.form.get('senderEmail') }
  get senderName() { return this.form.get('senderName') }
  get receverEmail() { return this.form.get('receverEmail') }
  get receverName() { return this.form.get('receverName') }
  get postitiveFeedback() { return this.form.get('postitiveFeedback') }
  get toImproveFeedback() { return this.form.get('toImproveFeedback') }
  get comment() { return this.form.get('comment') }
}
