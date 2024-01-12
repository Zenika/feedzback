import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation, booleanAttribute, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../../form/allowed-email-domains';
import { ValidationErrorMessagePipe } from '../../form/validation-error-message/validation-error-message.pipe';
import { PeopleService } from '../../people/people.service';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

@Component({
  selector: 'app-email-field',
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
  templateUrl: './email-field.component.html',
  styleUrl: './email-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmailFieldComponent {
  @HostBinding('class.app-email-field') hasCss = true;

  @Input({ transform: booleanAttribute }) forManager = false;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  @Input() email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email, this.allowedEmailDomainsValidator],
  });

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
    this.email.setValue(email);
    this.email.updateValueAndValidity();
  }
}
