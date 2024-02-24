import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmBeforeSubmitData } from './confirm-before-submit.types';

@Component({
  selector: 'app-confirm-before-submit',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './confirm-before-submit.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmBeforeSubmitComponent {
  data: ConfirmBeforeSubmitData = inject(MAT_DIALOG_DATA);
}
