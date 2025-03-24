import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-credentials-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './credentials-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CredentialsDialogComponent {
  disabled = input(false);

  signIn = output<{ email: string; password: string }>();

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  protected submit() {
    if (this.form.invalid) {
      return;
    }
    this.signIn.emit({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });
  }
}
