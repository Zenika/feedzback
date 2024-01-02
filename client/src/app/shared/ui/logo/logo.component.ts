import { Component, HostBinding, Input, ViewEncapsulation, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoComponent {
  @Input({ transform: booleanAttribute }) lowercase = false;

  @HostBinding('class') get css() {
    return `app-logo${this.lowercase ? ' app-logo--lowercase' : ''}`;
  }
}
