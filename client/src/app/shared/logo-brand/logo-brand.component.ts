import { Component, ViewEncapsulation } from '@angular/core';

let uid = 1;

@Component({
  selector: 'app-logo-brand',
  host: { class: 'app-logo-brand' },
  templateUrl: './logo-brand.component.html',
  styleUrl: './logo-brand.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoBrandComponent {
  protected uid = uid++;
}
