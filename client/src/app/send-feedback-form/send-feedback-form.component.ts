import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {getFormControlError} from '../get-form-control-error';
import {SendFeedback} from '../model/sendFeedback';
import {AuthService} from '../services/auth.service';
import {GraphqlService} from '../services/graphql/graphql.service';

@Component({
  selector: 'app-send-feedback-form',
  templateUrl: './send-feedback-form.component.html',
  styleUrls: ['./send-feedback-form.component.css'],
})
export class SendFeedbackFormComponent implements OnInit {
  userEmail?: String;
  userName?: String;
  loading?: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private graphqlService: GraphqlService,
  ) {
    const user = this.authService.userSnapshot;
    this.userEmail =
      decodeURIComponent(this.queryParams.get('senderEmail')!) === 'null' ?
        user?.email! :
        decodeURIComponent(this.queryParams.get('senderEmail')!);
    this.userName =
      this.queryParams.get('senderName') === null ?
        user?.displayName! :
        this.queryParams.get('senderName')!;
    graphqlService.loading.subscribe((loading)=> {
      this.loading = loading;
    });
  }

  private feedbackMaxLength = 500;
  private queryParams = this.activatedRoute.snapshot.queryParamMap;
  public getFormControlError = getFormControlError;

  ngOnInit(): void {}
  decodedReceverEmail = decodeURIComponent(
      this.queryParams.get('receverEmail') || '',
  );

  form = new FormGroup({
    receverEmail: new FormControl(this.decodedReceverEmail, [
      Validators.required,
      Validators.email,
    ]),
    receverName: new FormControl(
        this.queryParams.get('receverName'),
        Validators.required,
    ),
    postitiveFeedback: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.feedbackMaxLength),
    ]),
    toImproveFeedback: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.feedbackMaxLength),
    ]),
    comment: new FormControl(''),
  });

  get receverEmail() {
    return this.form.get('receverEmail');
  }

  get receverName() {
    return this.form.get('receverName');
  }

  get postitiveFeedback() {
    return this.form.get('postitiveFeedback');
  }

  get toImproveFeedback() {
    return this.form.get('toImproveFeedback');
  }

  get comment() {
    return this.form.get('comment');
  }

  async onSubmit() {
    const token = await this.authService.getUserTokenId();
    const feedback = new SendFeedback(
      token!,
      this.userName,
      this.userEmail,
      this.receverEmail?.value,
      this.receverName?.value,
      this.postitiveFeedback?.value,
      this.toImproveFeedback?.value,
      this.comment?.value,
    );
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.graphqlService.sendFeedback(feedback);
    }
  }
}
