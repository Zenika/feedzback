import { DOCUMENT } from '@angular/common';
import { Component, inject, input, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { filter, map, startWith, tap } from 'rxjs';
import { ColorGenFormValue } from './color-gen-form.types';
import { hexColorValidator } from './color-gen-form.validator';

@Component({
  selector: 'app-color-gen-form',
  host: { class: 'app-color-gen-form' },
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './color-gen-form.component.html',
  styleUrl: './color-gen-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ColorGenFormComponent {
  protected document = inject(DOCUMENT);

  protected form = inject(NonNullableFormBuilder).group({
    rgb: ['#ee2238', [Validators.required, hexColorValidator]],
    start: [0 as number | null],
    end: [100 as number | null],
    easing: ['linear', [Validators.required]],
    reverse: [false],
    neutral: [false],
  });

  formValueChange = outputFromObservable<ColorGenFormValue | undefined>(
    this.form.statusChanges.pipe(
      takeUntilDestroyed(),
      startWith(this.form.valid ? 'VALID' : 'INVALID'),
      filter((status) => status === 'VALID'),
      map(() => this.form.value as ColorGenFormValue),
      tap((formValue) => this.store(formValue)),
    ),
  );

  easingFuncNames = input.required<string[]>();

  constructor() {
    this.restore();
  }

  // ----- settings -----

  protected settingsDialog?: MatDialogRef<unknown>;

  private dialog = inject(MatDialog);

  protected settingsTemplate = viewChild.required<TemplateRef<unknown>>('settingsTemplate');

  protected settingsCtrl = new FormControl('');

  protected openSettings() {
    this.settingsDialog = this.dialog.open(this.settingsTemplate(), { width: '420px' });
  }

  protected applySettings() {
    try {
      const value = JSON.parse(this.settingsCtrl.value!);

      this.form.setValue(value);
      this.form.updateValueAndValidity();

      this.settingsDialog?.close();

      this.settingsCtrl.setValue(JSON.stringify(value));
    } catch {
      this.settingsCtrl.setErrors({ settings: true });
    }
  }

  // ----- storage -----

  private store(formValue: ColorGenFormValue) {
    this.document.defaultView?.localStorage.setItem('app-color-gen-form', JSON.stringify(formValue));
  }

  private restore() {
    const value = this.document.defaultView?.localStorage.getItem('app-color-gen-form');
    if (!value) {
      return;
    }
    try {
      this.form.setValue(JSON.parse(value));
      this.form.updateValueAndValidity();
    } catch {
      console.error('ColorGenFormComponent: unable to restore value', value);
    }
  }
}
