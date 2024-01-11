import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  EMAIL_REGEXP,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../../shared/form/multiple-emails';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message/validation-error-message.pipe';

@Component({
  selector: 'app-emails-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ValidationErrorMessagePipe,
  ],
  templateUrl: './emails-field.component.html',
  styleUrl: './emails-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmailsFieldComponent {
  @HostBinding('class.app-emails-field') hasCss = true;

  @Input() emails = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required, multipleEmailsValidatorFactory()],
  });

  protected multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;

  protected isInvalidEmail(email: string) {
    return !EMAIL_REGEXP.test(email);
  }

  protected add(event: MatChipInputEvent): void {
    const emails = getMultipleEmails(event.value);
    if (emails.length) {
      this.updateEmailsValue([...this.emails.value, ...emails]);
    }
    event.chipInput?.clear();
  }

  protected remove(email: string): void {
    const index = this.emails.value.indexOf(email);
    if (index !== -1) {
      const emails = [...this.emails.value];
      emails.splice(index, 1);
      this.updateEmailsValue(emails);
    }
  }

  protected edit(prevEmail: string, event: MatChipEditedEvent) {
    const currEmails = getMultipleEmails(event.value);
    if (!currEmails.length) {
      this.remove(prevEmail);
      return;
    }
    const index = this.emails.value.indexOf(prevEmail);
    if (index !== -1) {
      const emails = [...this.emails.value];
      emails.splice(index, 1, ...currEmails);
      this.updateEmailsValue(emails);
    }
  }

  private updateEmailsValue(emails: string[]) {
    this.emails.setValue(emails);
    this.emails.updateValueAndValidity();
  }
}
