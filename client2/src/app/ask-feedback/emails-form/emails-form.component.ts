import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ValidationErrorMessagePipe } from '../../shared/validation/validation-error-message.pipe';

@Component({
  selector: 'app-emails-form',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ValidationErrorMessagePipe,
  ],
  templateUrl: './emails-form.component.html',
  styleUrls: ['./emails-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmailsFormComponent implements OnInit {
  @HostBinding('class.app-emails-form') hasCss = true;

  @Input({ required: true }) emailsFormArray!: FormArray<FormControl<string | null>>;

  @Input() set initialEmailValues(emails: string[]) {
    emails.forEach(email => this.addReceiverEmail(email))
  }

  @Input() maxLength = 5;

  get canAddEmail(): boolean {
    return this.emailsFormArray.controls.length < this.maxLength;
  }

  ngOnInit(): void {
    if (!this.emailsFormArray.controls.length) {
      this.addReceiverEmail();
    }
  }

  protected addReceiverEmail(email = '') {
    if (!this.canAddEmail) {
      return;
    }
    this.emailsFormArray.controls.push(new FormControl(email, [Validators.required, Validators.email]));
  }

  protected removeReceiverEmail(index: number) {
    this.emailsFormArray.removeAt(index);
  }
}
