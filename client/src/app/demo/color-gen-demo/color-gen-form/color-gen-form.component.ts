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
import { hexColorValidator, RANGE_ERROR_KEY, rangeValidatorFactory } from './color-gen-form.validator';

@Component({
  selector: 'app-color-gen-form',
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
  private localStorage = inject(DOCUMENT).defaultView?.localStorage;

  protected form = inject(NonNullableFormBuilder).group(
    {
      color: ['#666666', [Validators.required, hexColorValidator]],
      start: [0, [Validators.required]],
      end: [100, [Validators.required]],
      easing: ['linear', [Validators.required]],
      reverse: [false],
      neutral: [false],
    },
    { validators: [rangeValidatorFactory()] },
  );

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
    this.initRangeErrorHandler();
    this.restore();
  }

  // ----- form -----

  private initRangeErrorHandler() {
    const updateRangeError = (formControl: FormControl) => {
      if (this.form.getError(RANGE_ERROR_KEY)) {
        formControl.setErrors({ ...formControl.errors, [RANGE_ERROR_KEY]: true });
      } else if (formControl.hasError(RANGE_ERROR_KEY)) {
        const errors = { ...formControl.errors };
        delete errors[RANGE_ERROR_KEY];
        formControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    };
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      updateRangeError(this.form.controls.start);
      updateRangeError(this.form.controls.end);
    });
  }

  // ----- settings -----

  private settingsDialog?: MatDialogRef<unknown>;

  private dialog = inject(MatDialog);

  private settingsTemplate = viewChild.required<TemplateRef<unknown>>('settingsTemplate');

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

      this.settingsCtrl.setValue(JSON.stringify(value)); // This is just to format the value
    } catch {
      this.settingsCtrl.setErrors({ settings: true });
    }
  }

  // ----- storage -----

  private store(formValue: ColorGenFormValue) {
    this.localStorage?.setItem('app-color-gen-form', JSON.stringify(formValue));
  }

  private restore() {
    const value = this.localStorage?.getItem('app-color-gen-form');
    if (!value) {
      return;
    }
    try {
      this.form.setValue(JSON.parse(value));
      this.form.updateValueAndValidity();
    } catch {
      this.localStorage?.removeItem('app-color-gen-form');
      console.error('ColorGenFormComponent: unable to restore value', value);
    }
  }
}
