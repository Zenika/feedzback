import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConsultantService } from '../shared/consultant/consultant.service';
import { ValidationErrorMessagePipe } from '../shared/form/validation-error-message';

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
  ],
  templateUrl: './consultant.component.html',
  styleUrl: './consultant.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ConsultantComponent {
  @HostBinding('class.app-consultant') hasCss = true;

  private consultantService = inject(ConsultantService);

  protected submitInProgress = false;

  protected form = inject(NonNullableFormBuilder).group({
    managerEmail: [this.consultantService.data().managerEmail],
  });

  protected managedEmails: string[] = [];

  protected onSubmit() {
    this.submitInProgress = true;
    this.consultantService.updateManager(this.form.value.managerEmail!).subscribe({
      error: () => (this.submitInProgress = false),
      complete: () => (this.submitInProgress = false),
    });
  }
}
