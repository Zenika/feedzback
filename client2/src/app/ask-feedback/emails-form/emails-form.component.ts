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

  @Input() formArray = new FormArray<FormControl<string | null>>([]);

  @Input() set values(emails: string[]) {
    this.formArray.clear();
    emails.forEach((email) => this.add(email));
  }

  @Input() limit = 5;

  get canAdd(): boolean {
    return this.formArray.controls.length < this.limit;
  }

  ngOnInit(): void {
    if (!this.formArray.controls.length) {
      this.add();
    }
  }

  protected add(email = '') {
    if (!this.canAdd) {
      return;
    }
    this.formArray.push(new FormControl(email, [Validators.required, Validators.email]));
  }

  protected removeAt(index: number) {
    if (this.formArray.length === 1) {
      return;
    }
    this.formArray.removeAt(index);
  }
}
