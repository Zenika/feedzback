import { Component, ViewEncapsulation } from '@angular/core';

let uid = 1;

@Component({
  selector: 'app-logo-zenika',
  host: { class: 'app-logo-zenika' },
  templateUrl: './zenika-logo.component.html',
  styleUrl: './zenika-logo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoZenikaComponent {
  protected linearGradientId = `app-logo-zenika-${uid++}`;
}
