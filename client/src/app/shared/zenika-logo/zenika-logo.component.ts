import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-zenika-logo',
  host: { class: 'app-zenika-logo' },
  standalone: true,
  templateUrl: './zenika-logo.component.html',
  styleUrl: './zenika-logo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ZenikaLogoComponent {}
