import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConsultantService } from '../shared/consultant/consultant.service';
import { ValidationErrorMessagePipe } from '../shared/form/validation-error-message';
import { MessageComponent } from '../shared/ui/message/message.component';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../shared/form/allowed-email-domains';

@Component({
  selector: 'app-consultant',
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
  templateUrl: './consultant.component.html',
  styleUrl: './consultant.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ConsultantComponent {
  @HostBinding('class.app-consultant') hasCss = true;

  private consultantService = inject(ConsultantService);

  protected submitInProgress = false;

  private currentManagerEmail = this.consultantService.data().managerEmail;

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
    this.consultantService.updateManager(this.form.value.managerEmail!).subscribe({
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
