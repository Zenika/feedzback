import { Component, ViewEncapsulation, model } from '@angular/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-burger',
  host: {
    class: 'app-burger',
    '[class.app-burger--active]': 'active()',
    '[tabIndex]': '0',
    '(click)': 'toggle()',
    '(keyup.enter)': 'toggle()',
  },
  hostDirectives: [MatRipple],
  templateUrl: './burger.component.html',
  styleUrl: './burger.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BurgerComponent {
  active = model(false);

  toggle() {
    this.active.update((active) => !active);
  }
}
