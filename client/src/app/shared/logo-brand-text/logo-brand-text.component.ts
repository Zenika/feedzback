import { Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logo-brand-text',
  host: {
    '[attr.aria-label]': '"Feedback"',
    class: 'app-logo-brand-text',
    '[class.app-logo-brand-text--lowercase]': 'lowercase()',
  },
  imports: [MatIconModule],
  templateUrl: './logo-brand-text.component.html',
  styleUrl: './logo-brand-text.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LogoBrandTextComponent {
  lowercase = input(false, { transform: booleanAttribute });
}
