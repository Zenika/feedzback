import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth';
import { AutocompleteEmailComponent } from '../shared/autocomplete-email';
import { EmployeeService } from '../shared/employee/employee.service';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../shared/form/allowed-email-domains';
import { forbiddenValuesValidatorFactory } from '../shared/form/forbidden-values';
import { ValidationErrorMessagePipe } from '../shared/form/validation-error-message';
import { MessageComponent } from '../shared/ui/message/message.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    AutocompleteEmailComponent,
    ValidationErrorMessagePipe,
    MessageComponent,
  ],
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class SettingsComponent {
  @HostBinding('class.app-settings') hasCss = true;

  private employeeService = inject(EmployeeService);

  protected submitInProgress = false;

  private currentManagerEmail = this.employeeService.dataSnapshot.managerEmail;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  private forbiddenValuesValidator = forbiddenValuesValidatorFactory([inject(AuthService).userSnapshotEmail!]);

  protected form = inject(NonNullableFormBuilder).group({
    managerEmail: [
      this.currentManagerEmail,
      [Validators.email, this.allowedEmailDomainsValidator, this.forbiddenValuesValidator],
    ],
  });

  protected get submitButtonDisabled() {
    return (
      this.form.controls.managerEmail.value === this.currentManagerEmail || this.form.invalid || this.submitInProgress
    );
  }

  protected success: boolean | null = null;

  protected onSubmit() {
    this.form.disable();
    this.submitInProgress = true;
    this.success = null;
    this.employeeService.updateManager(this.form.controls.managerEmail.value).subscribe({
      error: () => {
        this.form.enable();
        this.submitInProgress = false;
        this.success = false;
      },
      complete: () => {
        this.form.enable();
        this.submitInProgress = false;
        this.success = true;
        this.currentManagerEmail = this.form.controls.managerEmail.value;
      },
    });
  }
}
