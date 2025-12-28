import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, fromEvent, map, Observable, of } from 'rxjs';
import { DialogComponent, DialogData } from '../dialog';
import { LoadingService } from '../loading';
import { UnsavedFormConfig } from './unsaved-form.types';

@Injectable()
export class UnsavedFormService {
  private document = inject(DOCUMENT);

  private destroyRef = inject(DestroyRef);

  private matDialog = inject(MatDialog);

  private loadingService = inject(LoadingService);

  private form?: AbstractControl;

  private storageKey?: string;

  private readonly storageKeyPrefix = 'unsavedForm.';

  private initialFormValue?: string;

  // ----- Core -----

  register({ form, storageKey, saveWhenLeaving }: UnsavedFormConfig) {
    this.form = form;
    this.storageKey = storageKey;

    this.initialFormValue = this.stringifyFormValue();

    if (saveWhenLeaving) {
      this.saveWhenLeaving();
    }
  }

  markAsPristine() {
    this.form?.markAsPristine();
    this.storage(null);
  }

  private isPristine() {
    return this.form?.pristine ?? true;
  }

  // ----- Storage -----

  hasLocalStorage() {
    return !!this.storage();
  }

  restoreFromLocalStorage(): boolean {
    const storageValue = this.storage();
    if (storageValue) {
      try {
        const formValue = JSON.parse(storageValue);
        this.form?.setValue(formValue);
        this.form?.updateValueAndValidity();
        this.form?.markAsDirty();
        return true;
      } catch {
        console.error('UnsavedFormService: unable to restore form value.');
      }
    }
    return false;
  }

  private saveToLocalStorage() {
    if (this.isPristine()) {
      return;
    }

    const storageValue = this.stringifyFormValue();
    if (!storageValue) {
      return;
    }

    if (storageValue === this.initialFormValue) {
      this.storage(null);
    } else {
      this.storage(storageValue);
    }
  }

  private storage(): string | void; // get
  private storage(value: null): void; // remove
  private storage(value: string): void; // set

  private storage(value?: string | null): string | void {
    const storage = this.document.defaultView?.localStorage;
    if (!storage) {
      return;
    }

    if (!this.storageKey) {
      return this.logError();
    }
    const key = this.storageKeyPrefix + this.storageKey;

    switch (value) {
      case undefined: {
        return storage.getItem(key) ?? undefined;
      }
      case null: {
        return storage.removeItem(key);
      }
      default: {
        return storage.setItem(key, value);
      }
    }
  }

  private saveWhenLeaving() {
    fromEvent(this.document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.document.visibilityState === 'hidden'),
      )
      .subscribe(() => this.saveToLocalStorage());

    this.destroyRef.onDestroy(() => this.saveToLocalStorage());
  }

  // ----- Dialog -----

  canLeave(data: DialogData): Observable<boolean> {
    if (this.isPristine()) {
      return of(true);
    }

    // Note: we don't want 2 popups displayed at the same time!
    // So, let's skip the loading overlay in favor of the unsaved-form dialog
    this.loadingService.flush();

    return this.matDialog
      .open(DialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(map((canLeave?: boolean) => (canLeave === undefined ? false : canLeave)));
  }

  // ----- Utils -----

  private stringifyFormValue(): string | undefined {
    if (!this.form) {
      this.logError();
      return;
    }
    return JSON.stringify(this.form.value);
  }

  private logError() {
    console.error('UnsavedFormService: you first need to register a form and a storageKey.');
  }
}
