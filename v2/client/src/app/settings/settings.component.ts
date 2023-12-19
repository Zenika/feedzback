import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../shared/employee/employee.service';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../shared/form/allowed-email-domains';
import { ValidationErrorMessagePipe } from '../shared/form/validation-error-message';
import { MessageComponent } from '../shared/ui/message/message.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    MessageComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent {
  @HostBinding('class.app-settings') hasCss = true;

  private employeeService = inject(EmployeeService);

  protected submitInProgress = false;

  private currentManagerEmail = this.employeeService.data().managerEmail;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  protected form = inject(NonNullableFormBuilder).group({
    managerEmail: [this.currentManagerEmail, [Validators.email, this.allowedEmailDomainsValidator]],
  });

  protected get submitButtonDisabled() {
    return this.form.value.managerEmail === this.currentManagerEmail || this.form.invalid || this.submitInProgress;
  }

  protected success: boolean | null = null;

  protected onSubmit() {
    this.form.disable();
    this.submitInProgress = true;
    this.employeeService.updateManager(this.form.value.managerEmail!).subscribe({
      error: () => {
        this.form.enable();
        this.submitInProgress = false;
        this.success = false;
      },
      complete: () => {
        this.form.enable();
        this.submitInProgress = false;
        this.success = true;
      },
    });
  }
}
