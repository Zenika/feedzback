import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Component, ElementRef, HostBinding, Input, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipGrid, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { EmployeeSearchResult, EmployeeSearchResultList } from 'src/app/shared/employee/employee.types';
import {
  EMAIL_REGEXP,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../../shared/form/multiple-emails';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message/validation-error-message.pipe';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
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
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    AvatarPhotoComponent,
    MatAutocompleteModule,
  ],
})
export class EmailsFieldAutocompleteComponent {
  @HostBinding('class.app-emails-field-autocomplete') hasCss = true;

  @Input() emails = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required, multipleEmailsValidatorFactory()],
  });

  @ViewChild('searchInput') searchInputField!: ElementRef;
  @ViewChild(MatChipGrid) matChipGrid!: MatChipGrid;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  inputEmail: FormControl;

  autocompleteResult: EmployeeSearchResultList = [];

  protected multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private employeeService = inject(EmployeeService);

  constructor() {
    this.inputEmail = new FormControl();
    this.inputEmail.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((term) => term.length >= 3),
      )
      .subscribe((term) => this.search(term));
  }

  private search(term: string) {
    this.employeeService.searchEmployee(term).subscribe((result) => {
      this.autocompleteResult = result;
    });
  }

  protected selectEmail(result: EmployeeSearchResult) {
    this.autocompleteResult = [];
    const emails = getMultipleEmails(result.email);
    if (emails.length) {
      this.updateEmailsValue([...this.emails.value, ...emails]);
    }
    // this.searchInputField.nativeElement.focus();
  }

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
