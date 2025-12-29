import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UnsavedFormGuard, UnsavedFormService } from '../../shared/unsaved-form';

@Component({
  selector: 'app-unsaved-form-guard-demo',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  providers: [UnsavedFormService], // <-- Required provider
  templateUrl: './unsaved-form-guard-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UnsavedFormGuardDemoComponent implements UnsavedFormGuard {
  unsavedFormService = inject(UnsavedFormService); // <-- Implementing `UnsavedFormGuard` interface

  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  constructor() {
    this.unsavedFormService.register({
      form: this.form,
      storageKey: 'unsavedFormStorageDemo',
    });
  }

  submit() {
    // Save the form on the server... and then...
    this.unsavedFormService.markAsPristineAndDeleteStoredValue(); // <-- Indicate that the route can be de-activated
  }
}
