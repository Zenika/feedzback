import {Component} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {getFormControlError} from '../get-form-control-error';
import {AuthService} from '../services/auth.service';
import {FeedbackRequest} from '../model/feedbackRequest';
import {GraphqlService} from '../services/graphql/graphql.service';

@Component({
  selector: 'app-ask-feedback-form',
  templateUrl: './ask-feedback-form.component.html',
  styleUrls: ['./ask-feedback-form.component.css'],
})
export class AskFeedbackFormComponent {
  userEmail?: string;
  userName?: string;
  loading: boolean = false;
  testEmail: string = 'test@exemple.com';
  testName: string = 'test';
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private graphqlService: GraphqlService,
  ) {
    const user = this.authService.getUserDetails();
    this.userEmail = user?.email!;
    this.userName = user?.displayName!;
    graphqlService.loading.subscribe((loading)=> {
      this.loading = loading;
    });
  }

  private queryParams = this.activatedRoute.snapshot.queryParamMap;
  public getFormControlError = getFormControlError;

  private receiverEmailValue = this.queryParams.get('receverEmail') || '';


  public form = new FormGroup({
    receverEmail: new FormControl(this.receiverEmailValue, [
      Validators.required,
      this.multipleEmailsValidator
    ]),
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

  multipleEmailsValidator(control: AbstractControl): ValidationErrors | null{
    const emailArray = control.value
      .split(';')
      .map((email: string) => email.trim())
      .filter((email: string) => !!email); // Remove empty elements

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      for (const email of emailArray) {
        if (!emailPattern.test(email)) {
          return { invalidEmail: true };
        }
      }

    return null; // Validation passed
  }

  async onSubmit() {
    const token = await this.authService.getUserTokenId();
    const emails = this.receverEmail?.value.split(';').map((email: String) => email.trim());
    for(const senderEmail of emails) {
      const feedback = new FeedbackRequest(
        token!,
        this.userName ? this.userName : this.testEmail,
        this.userEmail ? this.userEmail : this.testName,
        senderEmail,
        this.message?.value,
      );
      this.form.markAllAsTouched();
      if (this.form.valid) {
        this.graphqlService.askFeedback(feedback);
      }
  }
  }


}
