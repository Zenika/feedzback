import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmBeforeSubmitData } from './confirm-before-submit.types';

@Component({
  selector: 'app-confirm-before-submit',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  templateUrl: './confirm-before-submit.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmBeforeSubmitComponent {
  data: ConfirmBeforeSubmitData = inject(MAT_DIALOG_DATA);
}
