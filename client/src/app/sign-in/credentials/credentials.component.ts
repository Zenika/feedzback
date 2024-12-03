import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-credentials',
  host: { class: 'app-credentials' },
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CredentialsComponent {
  disabled = input(false);

  signIn = output<{ email: string; password: string }>();

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required]),
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
