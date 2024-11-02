import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-divider',
  host: { class: 'app-divider' },
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DividerComponent {}
