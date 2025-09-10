import { Component, computed, effect, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  protected form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private passwordVisible = signal(false);

  protected passwordConfig = computed(() =>
    this.passwordVisible()
      ? {
          inputType: 'text',
          buttonLabel: $localize`:@@Component.CredentialsDialog.HidePassword:Masquer le mot de passe`,
          buttonIcon: 'visibility_off',
        }
      : {
          inputType: 'password',
          buttonLabel: $localize`:@@Component.CredentialsDialog.ShowPassword:Afficher le mot de passe`,
          buttonIcon: 'visibility',
        },
  );

  disabled = input(false);

  signIn = output<Required<typeof this.form.value>>();

  constructor() {
    effect(() => this.form[this.disabled() ? 'disable' : 'enable']());
  }

  protected togglePasswordVisible(visible?: boolean) {
    this.passwordVisible.update((passwordVisible) => visible ?? !passwordVisible);
  }

  protected submit() {
    if (this.form.invalid) {
      return;
    }
    this.togglePasswordVisible(false);
    this.signIn.emit(this.form.value as Required<typeof this.form.value>);
  }
}
