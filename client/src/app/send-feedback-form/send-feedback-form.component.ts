import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-send-feedback-form',
  templateUrl: './send-feedback-form.component.html',
  styleUrls: ['./send-feedback-form.component.css']
})
export class SendFeedbackFormComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  private feedbackMaxLength = 500;
  private queryParams = this.activatedRoute.snapshot.queryParamMap;

  public form = new FormGroup({
    yourEmail: new FormControl(this.queryParams.get('senderName'), [Validators.required, Validators.email]),
    yourName: new FormControl(this.queryParams.get('senderEmail')),
    coworkerEmail: new FormControl(this.queryParams.get('receverName'), [Validators.required, Validators.email]),
    coworkerName: new FormControl(this.queryParams.get('receverEmail')),
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

  get yourEmail() { return this.form.get('yourEmail') }
  get coworkerEmail() { return this.form.get('coworkerEmail') }
  get postitiveFeedback() { return this.form.get('postitiveFeedback') }
  get toImproveFeedback() { return this.form.get('toImproveFeedback') }

  get yourEmailErrorMessage(): String | null {
    if (this.yourEmail?.hasError('required'))
      return "Ce champ est requis"
    else if (this.yourEmail?.hasError('email'))
      return "Veuillez saisir une adresse email valide"
    return null
  }

  get coworkerEmailErrorMessage(): String | null {
    if (this.coworkerEmail?.hasError('required'))
      return "Ce champ est requis"
    else if (this.coworkerEmail?.hasError('email'))
      return "Veuillez saisir une adresse email valide"
    return null
  }

  get postitiveFeedbackErrorMessage(): String | null {
    if (this.postitiveFeedback?.hasError('required'))
      return "Ce champ est requis"
    if (this.postitiveFeedback?.hasError('maxlength'))
      return `Ce champ est est limité à ${this.feedbackMaxLength} charactères`
    return null
  }

  get toImproveFeedbackErrorMessage(): String | null {
    if (this.toImproveFeedback?.hasError('required'))
      return "Ce champ est requis"
    if (this.toImproveFeedback?.hasError('maxlength'))
      return `Ce champ est est limité à ${this.feedbackMaxLength} charactères`
    return null
  }
}
