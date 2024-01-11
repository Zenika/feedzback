import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Input, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipEditedEvent, MatChipInput, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { PeopleService } from 'src/app/shared/people/people.service';
import {
  EMAIL_REGEXP,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../../shared/form/multiple-emails';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message/validation-error-message.pipe';
import { AvatarPhotoComponent } from '../avatar-photo.component/avatar-photo.component';

@Component({
  selector: 'app-emails-field-autocomplete',
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
    AvatarPhotoComponent,
  ],
  templateUrl: './emails-field-autocomplete.component.html',
  styleUrl: './emails-field-autocomplete.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmailsFieldAutocompleteComponent {
  @HostBinding('class.app-emails-field-autocomplete') hasCss = true;

  @Input() emails = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required, multipleEmailsValidatorFactory()],
  });

  @ViewChild(MatChipInput) matChipInput!: MatChipInput;

  searchInput = new FormControl('', { nonNullable: true });

  readonly searchMinLength = 3;

  protected multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private peopleService = inject(PeopleService);

  searchResults$ = this.searchInput.valueChanges.pipe(
    takeUntilDestroyed(),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((searchInput) => {
      if (searchInput.length < this.searchMinLength) {
        return of([]);
      }
      return this.peopleService.search(searchInput);
    }),
  );

  protected isInvalidEmail(email: string) {
    return !EMAIL_REGEXP.test(email);
  }

  protected addEmail(email: string): void {
    const emails = getMultipleEmails(email);
    if (emails.length) {
      this.updateEmailsValue([...this.emails.value, ...emails]);
    }
    this.matChipInput.clear();
    this.searchInput.setValue('');
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
