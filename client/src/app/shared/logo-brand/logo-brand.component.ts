import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-logo-brand',
  host: { class: 'app-logo-brand' },
  templateUrl: './logo-brand.component.html',
  styleUrl: './logo-brand.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoBrandComponent {}
