import { Component, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth';
import { AutocompleteEmailComponent } from '../shared/autocomplete-email';
import { EmployeeService } from '../shared/employee/employee.service';
import { NotificationService } from '../shared/notification/notification.service';
import { MessageComponent } from '../shared/ui/message';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../shared/validation/allowed-email-domains';
import { forbiddenValuesValidatorFactory } from '../shared/validation/forbidden-values';
import { ValidationErrorMessagePipe } from '../shared/validation/validation-error-message';

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
  private employeeService = inject(EmployeeService);

  private notificationService = inject(NotificationService);

  protected submitInProgress = false;

  private currentManagerEmail = this.employeeService.data()!.managerEmail;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  private forbiddenValuesValidator = forbiddenValuesValidatorFactory([inject(AuthService).userEmail()]);

  protected form = inject(NonNullableFormBuilder).group({
    managerEmail: [
      this.currentManagerEmail,
      [Validators.required, Validators.email, this.allowedEmailDomainsValidator, this.forbiddenValuesValidator],
    ],
  });

  protected get submitButtonDisabled() {
    return (
      this.form.controls.managerEmail.value === this.currentManagerEmail || this.form.invalid || this.submitInProgress
    );
  }

  protected onSubmit() {
    this.form.disable();
    this.submitInProgress = true;
    this.employeeService.updateManager(this.form.controls.managerEmail.value).subscribe({
      error: () => {
        this.form.enable();
        this.submitInProgress = false;
        this.notificationService.showError();
      },
      complete: () => {
        this.form.enable();
        this.submitInProgress = false;
        this.currentManagerEmail = this.form.controls.managerEmail.value;
        this.notificationService.show(
          $localize`:@@Component.Settings.UpdateSuccess:Vos paramètres ont bien été mis à jour.`,
          'success',
        );
      },
    });
  }
}
