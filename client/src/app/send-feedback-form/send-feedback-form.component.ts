import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFormControlError } from '../get-form-control-error';
import { Apollo, gql } from 'apollo-angular';
import { SendRequest } from '../model/sendRequest';

@Component({
  selector: 'app-send-feedback-form',
  templateUrl: './send-feedback-form.component.html',
  styleUrls: ['./send-feedback-form.component.css']
})
export class SendFeedbackFormComponent implements OnInit {
  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private router: Router) { }

  private feedbackMaxLength = 500;
  private queryParams = this.activatedRoute.snapshot.queryParamMap;
  public getFormControlError = getFormControlError

  private mutation = gql`
  mutation SendFeedback($sendRequest:SendRequest!){
    sendFeedback(sendRequest:$sendRequest)
  }
  `;

  public form = new FormGroup({
    senderEmail: new FormControl(this.queryParams.get('senderEmail'), [Validators.required, Validators.email]),
    senderName: new FormControl(this.queryParams.get('senderName'), Validators.required),
    receverEmail: new FormControl(this.queryParams.get('receverEmail'), [Validators.required, Validators.email]),
    receverName: new FormControl(this.queryParams.get('receverName'), Validators.required),
    postitiveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.feedbackMaxLength)]),
    toImproveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.feedbackMaxLength)]),
    comment: new FormControl(''),
  });

  get senderEmail() { return this.form.get('senderEmail') }
  get senderName() { return this.form.get('senderName') }
  get receverEmail() { return this.form.get('receverEmail') }
  get receverName() { return this.form.get('receverName') }
  get postitiveFeedback() { return this.form.get('postitiveFeedback') }
  get toImproveFeedback() { return this.form.get('toImproveFeedback') }
  get comment() { return this.form.get('comment') }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      this.apollo.mutate({
        mutation: this.mutation,
        variables: {
          sendRequest: new SendRequest(
            this.senderName?.value,
            this.senderEmail?.value,
            this.receverName?.value,
            this.receverEmail?.value,
            this.postitiveFeedback?.value,
            this.toImproveFeedback?.value,
            this.comment?.value
          ),
        },
      }).subscribe(({data}: any) => {
        this.router.navigate(['/feedbackEnvoye', { result: data.sendFeedback }])
      });
    }
  }
}