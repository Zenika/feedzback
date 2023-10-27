import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { getFormControlError } from '../shared/forms/get-form-control-error';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { AskFeedback } from '../shared/types/feedbackRequest';

@Component({
  selector: 'app-ask-feedback',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule], // !FIXME: don't use `FormsModule`
  templateUrl: './ask-feedback.component.html',
  styleUrls: ['./ask-feedback.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})
export class AskFeedbackComponent {
  userEmail?: string;
  userName?: string;
  loading = false;
  testEmail = 'test@exemple.com';
  testName = 'test';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private graphqlService: GraphQLService,
  ) {
    const user = this.authService.userSnapshot;
    this.userEmail = user?.email ?? undefined;
    this.userName = user?.displayName ?? undefined;

    graphqlService.loading.subscribe((loading) => (this.loading = loading));
  }

  private queryParams = this.activatedRoute.snapshot.queryParamMap;

  getFormControlError = getFormControlError; // TODO: create a pipe for this feature

  private receiverEmailValue = this.queryParams.get('receverEmail') || '';

  form = new FormGroup({
    receverEmail: new FormControl(this.receiverEmailValue, [Validators.required, this.multipleEmailsValidator]),
    message: new FormControl(''),
  });

  get senderEmail() {
    return this.form.get('senderEmail');
  }

  get senderName() {
    return this.form.get('senderName');
  }

  get receverEmail() {
    return this.form.get('receverEmail');
  }

  get message() {
    return this.form.get('message');
  }

  multipleEmailsValidator(control: AbstractControl): ValidationErrors | null {
    const emailArray = control.value
      .split(';')
      .map((email: string) => email.trim())
      .filter((email: string) => !!email);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    for (const email of emailArray) {
      if (!emailPattern.test(email)) {
        return { invalidEmail: true };
      }
    }

    return null;
  }

  async onSubmit() {
    const token = await this.authService.getUserTokenId();
    const emails = this.receverEmail?.value?.split(';').map((email) => email.trim()) ?? [];
    for (const senderEmail of emails) {
      const feedback: AskFeedback = {
        token: token!,
        name: this.userName ? this.userName : this.testEmail,
        email: this.userEmail ? this.userEmail : this.testName,
        senderEmail: senderEmail,
        text: this.message?.value ?? '',
      };

      this.form.markAllAsTouched();

      if (this.form.valid) {
        this.graphqlService.askFeedback(feedback);
      }
    }
  }
}
