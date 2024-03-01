import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './leave-form.component.html',
})
export class LeaveFormComponent {}
