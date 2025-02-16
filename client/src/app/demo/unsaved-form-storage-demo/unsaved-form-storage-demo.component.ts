import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UnsavedFormService } from '../../shared/unsaved-form';

@Component({
  selector: 'app-unsaved-form-storage-demo',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  providers: [UnsavedFormService], // <-- Required provider
  templateUrl: './unsaved-form-storage-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UnsavedFormStorageDemoComponent {
  private unsavedFormService = inject(UnsavedFormService);

  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  constructor() {
    this.unsavedFormService.register({
      form: this.form,
      storageKey: 'unsavedFormStorageDemo',
      saveWhenLeaving: true, // <-- Enabling local storage feature
    });

    this.unsavedFormService.restoreFromLocalStorage(); // <-- Restore form from local storage if any
  }

  submit() {
    // Save the form on the server... and then...
    this.unsavedFormService.markAsPristine();
  }
}
