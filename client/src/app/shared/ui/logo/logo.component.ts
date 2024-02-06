import { Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  host: {
    class: 'app-logo',
    '[class.app-logo--lowercase]': 'lowercase()',
  },
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoComponent {
  lowercase = input(false, { transform: booleanAttribute });
}
