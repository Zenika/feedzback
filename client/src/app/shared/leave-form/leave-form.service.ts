import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class LeaveFormService {
  formGroup!: FormGroup;

  private snapshot?: unknown;

  registerForm(formGroup: FormGroup) {
    this.formGroup = formGroup;
    this.takeSnapshot();
  }

  takeSnapshot() {
    this.snapshot = this.formGroup.value;
  }

  valueChanged() {
    return JSON.stringify(this.formGroup.value) !== JSON.stringify(this.snapshot);
  }
}
