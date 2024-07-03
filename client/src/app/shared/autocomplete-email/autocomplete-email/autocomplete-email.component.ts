import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation, booleanAttribute, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AvatarComponent } from '../../avatar';
import { PeopleService } from '../../people';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../../validation/allowed-email-domains';
import { ValidationErrorMessagePipe } from '../../validation/validation-error-message';

@Component({
  selector: 'app-autocomplete-email',
  host: { class: 'app-autocomplete-email' },
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    AvatarComponent,
  ],
  templateUrl: './autocomplete-email.component.html',
  styleUrl: './autocomplete-email.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AutocompleteEmailComponent {
  forManager = input(false, { transform: booleanAttribute });

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  email = input(
    new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, this.allowedEmailDomainsValidator],
    }),
  );

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

  protected updateQuery(query: string) {
    this.query$.next(query);
  }

  protected selectEmail(email: string) {
    this.email().setValue(email);
    this.email().updateValueAndValidity();
    this.query$.next('');
  }
}
