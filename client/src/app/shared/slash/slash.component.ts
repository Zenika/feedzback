import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slash',
  host: { class: 'app-slash' },
  imports: [MatIconModule],
  templateUrl: './slash.component.html',
  styleUrl: './slash.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SlashComponent {}
