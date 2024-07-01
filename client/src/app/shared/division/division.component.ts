import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-division',
  host: { class: 'app-division' },
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './division.component.html',
  styleUrl: './division.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DivisionComponent {
  a = input.required<string | number>();

  b = input.required<string | number>();
}
