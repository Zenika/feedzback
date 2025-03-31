import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { outputFromObservable, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, map, startWith, tap } from 'rxjs';
import { addFormControlErrors, removeFormControlErrors } from '../../../shared/validation/form-control-errors';
import { easingFuncNames } from '../color-gen-demo.constants';
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
    MatTooltipModule,
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

  easingFuncNames = easingFuncNames;

  constructor() {
    this.initRangeErrorHandler();
    this.restore();
  }

  // ----- form -----

  private initRangeErrorHandler() {
    const updateRangeError = (formControl: FormControl) => {
      if (this.form.getError(RANGE_ERROR_KEY)) {
        // Propagate the error from parent to child control
        addFormControlErrors(formControl, { [RANGE_ERROR_KEY]: true });
      } else if (formControl.hasError(RANGE_ERROR_KEY)) {
        // Propagate the removal of the error from the parent to the child control
        removeFormControlErrors(formControl, [RANGE_ERROR_KEY]);
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

  // ----- snapshot -----

  protected maxSnapshots = 10;

  protected snapshots = signal<{ alias: string; value: string }[]>([]);

  protected formValueSnapshot = toSignal(this.form.valueChanges.pipe(map((formValue) => JSON.stringify(formValue))), {
    initialValue: JSON.stringify(this.form.value),
  });

  protected takeSnapshot() {
    this.snapshots.update((snapshots) => [
      ...snapshots,
      {
        alias: this.nextSnapshotAlias,
        value: this.formValueSnapshot(),
      },
    ]);
  }

  protected hasSelectedSnapshot = computed(() =>
    this.snapshots().some(({ value }) => value === this.formValueSnapshot()),
  );

  protected removeSelectedSnapshot() {
    this.snapshots.update((snapshots) => snapshots.filter(({ value }) => value !== this.formValueSnapshot()));
  }

  protected applySnapshot(snapshot: string) {
    this.form.setValue(JSON.parse(snapshot));
    this.form.updateValueAndValidity();
  }

  private snapshotAliasList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  private snapshotAliasIndex = 0;

  private get nextSnapshotAlias() {
    return this.snapshotAliasList[this.snapshotAliasIndex++ % this.snapshotAliasList.length];
  }
}
