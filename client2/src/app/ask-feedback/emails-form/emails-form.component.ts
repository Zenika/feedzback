import { NgFor } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ALLOWED_EMAIL_DOMAINS } from 'src/app/shared/validation/allowed-email-domains/allowed-email-domain.provider';
import { allowedEmailDomainsValidatorFactory } from 'src/app/shared/validation/allowed-email-domains/allowed-email-domains.validator';
import { MULTIPLE_EMAILS_PLACEHOLDER } from 'src/app/shared/validation/multiple-emails.validator';
import { ValidationErrorMessagePipe } from '../../shared/validation/validation-error-message.pipe';

@Component({
  selector: 'app-emails-form',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ValidationErrorMessagePipe,
  ],
  templateUrl: './emails-form.component.html',
  styleUrls: ['./emails-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmailsFormComponent implements OnInit {
  @HostBinding('class.app-emails-form') hasCss = true;

  @Input({ required: true }) emailsFormArray!: FormArray<FormControl<string | null>>;

  multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  private buildEmailControl() {
    return new FormControl('', [Validators.required, Validators.email, this.allowedEmailDomainsValidator]);
  }

  ngOnInit(): void {
    if (!this.emailsFormArray.controls.length) {
      this.addReceiverEmail();
    }
  }

  protected addReceiverEmail() {
    this.emailsFormArray.controls.push(this.buildEmailControl());
    //this.emailsFormArray.updateValueAndValidity();
  }

  protected removeReceiverEmail(index: number) {
    this.emailsFormArray.removeAt(index);
    // this.emailsFormArray.updateValueAndValidity();
  }
}
