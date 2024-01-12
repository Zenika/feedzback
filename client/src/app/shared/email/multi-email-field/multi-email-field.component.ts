import { COMMA } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Input, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipEditedEvent, MatChipInput, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import {
  EMAIL_REGEXP,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../../form/multiple-emails';
import { ValidationErrorMessagePipe } from '../../form/validation-error-message/validation-error-message.pipe';
import { PeopleService } from '../../people/people.service';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

@Component({
  selector: 'app-multi-email-field',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    AvatarComponent,
  ],
  templateUrl: './multi-email-field.component.html',
  styleUrl: './multi-email-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MultiEmailFieldComponent {
  @HostBinding('class.app-multi-email-field') hasCss = true;

  @Input() emails = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required, multipleEmailsValidatorFactory()],
  });

  @ViewChild(MatChipInput) matChipInput!: MatChipInput;

  private peopleService = inject(PeopleService);

  private query$ = new Subject<string>();

  protected queryResults$ = this.query$.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((query) => {
      if (query.length < this.queryMinLength) {
        return of([]);
      }
      return this.peopleService.search(query);
    }),
  );

  readonly queryMinLength = 3;

  protected multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  protected readonly separatorKeysCodes = [COMMA] as const;

  protected isInvalidEmail(email: string) {
    return !EMAIL_REGEXP.test(email);
  }

  protected add(email: string): void {
    const emails = getMultipleEmails(email);
    if (emails.length) {
      this.updateEmailsValue([...this.emails.value, ...emails]);
    }
    this.matChipInput.clear();
    this.query$.next('');
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

  protected updateQuery(query: string) {
    this.query$.next(query);
  }
}
