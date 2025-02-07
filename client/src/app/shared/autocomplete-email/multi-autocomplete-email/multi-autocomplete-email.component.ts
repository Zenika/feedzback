import { COMMA } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, ViewEncapsulation, afterNextRender, inject, input, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipEditedEvent, MatChipInput, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { AvatarComponent } from '../../avatar';
import { PeopleService } from '../../people';
import {
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../../validation/multiple-emails';
import { ValidationErrorMessagePipe } from '../../validation/validation-error-message';

@Component({
  selector: 'app-multi-autocomplete-email',
  host: { class: 'app-multi-autocomplete-email' },
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
  templateUrl: './multi-autocomplete-email.component.html',
  styleUrl: './multi-autocomplete-email.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MultiAutocompleteEmailComponent {
  emails = input(
    new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, multipleEmailsValidatorFactory()],
    }),
  );

  isInvalidEmail = input<((email: string) => boolean) | undefined>(undefined);

  matChipInput = viewChild.required(MatChipInput);

  matAutocomplete = viewChild.required(MatAutocomplete);

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

  protected queryInputFocused$ = new BehaviorSubject(false);

  protected onQueryInputFocus() {
    this.queryInputFocused$.next(true);
  }

  protected onQueryInputBlur() {
    this.queryInputFocused$.next(false);

    if (!this.matAutocomplete().isOpen && this.matChipInput().inputElement.value) {
      this.add(this.matChipInput().inputElement.value);
    }
  }

  private subscription?: Subscription;

  constructor() {
    afterNextRender(() => {
      this.subscription = this.matAutocomplete()
        .closed.pipe(
          withLatestFrom(this.queryInputFocused$),
          filter(([, queryInputFocused]) => !queryInputFocused),
        )
        .subscribe(() => {
          this.matChipInput().clear();
          this.query$.next('');
        });
    });

    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  protected add(email: string): void {
    const emails = getMultipleEmails(email);
    if (emails.length) {
      this.updateEmailsValue([...this.emails().value, ...emails]);
    }
    this.matChipInput().clear();
    this.query$.next('');
  }

  protected remove(email: string): void {
    const index = this.emails().value.indexOf(email);
    if (index !== -1) {
      const emails = [...this.emails().value];
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
    const index = this.emails().value.indexOf(prevEmail);
    if (index !== -1) {
      const emails = [...this.emails().value];
      emails.splice(index, 1, ...currEmails);
      this.updateEmailsValue(emails);
    }
  }

  private updateEmailsValue(emails: string[]) {
    this.emails().setValue(emails);
    this.emails().updateValueAndValidity();
  }

  protected updateQuery(query: string) {
    this.query$.next(query);
  }
}
