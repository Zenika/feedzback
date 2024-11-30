import { Component, ViewEncapsulation, model } from '@angular/core';

@Component({
  selector: 'app-burger',
  host: {
    class: 'app-burger',
    '[tabIndex]': '0',
    '[class.app-burger--active]': 'active()',
    '(click)': 'toggle()',
    '(keyup.enter)': 'toggle()',
  },
  standalone: true,
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
