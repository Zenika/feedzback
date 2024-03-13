import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogData } from './dialog.types';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
