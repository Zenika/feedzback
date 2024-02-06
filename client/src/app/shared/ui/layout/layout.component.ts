import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
