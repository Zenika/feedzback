import { COMMA, ENTER } from '@angular/cdk/keycodes';

import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipGrid, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { EmployeeSearchResult, EmployeeSearchResultList } from 'src/app/shared/employee/employee.types';
import {
  EMAIL_REGEXP,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../../shared/form/multiple-emails';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message/validation-error-message.pipe';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmployeeService } from '../../shared/employee/employee.service';
import { AvatarPhotoComponent } from '../avatar-photo.component/avatar-photo.component';
@Component({
  selector: 'app-emails-field-autocomplete',
  standalone: true,
  templateUrl: './emails-field-autocomplete.component.html',
  styleUrl: './emails-field-autocomplete.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    AvatarPhotoComponent,
    MatAutocompleteModule,
  ],
})
export class EmailsFieldAutocompleteComponent implements OnDestroy {
  @HostBinding('class.app-emails-field-autocomplete')
  hasCss = true;

  @Input()
  emails = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required, multipleEmailsValidatorFactory()],
  });

  @ViewChild('searchInput') searchInputField!: ElementRef;
  @ViewChild(MatChipGrid) matChipGrid!: MatChipGrid;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  inputEmail: FormControl;

  autocompleteResult: EmployeeSearchResultList = [];

  subscriptions: Subscription[] = [];

  protected multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private employeeService = inject(EmployeeService);

  constructor() {
    this.inputEmail = new FormControl();

    this.subscriptions.push(
      this.inputEmail.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          // Fetch begin when at least 3 chars
          filter((term) => term.length >= 3),
          // Do not fetch again if email selected from the autocomplete
          filter((term) => !this.autocompleteResult.find(({ email }) => email === term)),
        )
        .subscribe((term) => this.search(term)),
    );

    // Clear the autocompleteResult when inputEmail is empty
    this.subscriptions.push(
      this.inputEmail.valueChanges.pipe(filter((term) => term.length === 0)).subscribe(() => {
        this.autocompleteResult = [];
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private search(term: string) {
    this.employeeService.searchEmployee(term).subscribe((result) => {
      this.autocompleteResult = result;
    });
  }

  protected selectEmail(result: EmployeeSearchResult) {
    const emails = getMultipleEmails(result.email);
    if (emails.length) {
      this.updateEmailsValue([...this.emails.value, ...emails]);
    }

    this.inputEmail.setValue('');
  }

  protected isInvalidEmail(email: string) {
    return !EMAIL_REGEXP.test(email);
  }

  protected add(event: MatChipInputEvent): void {
    const emails = getMultipleEmails(event.value);
    if (emails.length) {
      this.updateEmailsValue([...this.emails.value, ...emails]);
    }
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
