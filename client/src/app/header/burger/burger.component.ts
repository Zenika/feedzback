import { Component, ViewEncapsulation, model } from '@angular/core';

@Component({
  selector: 'app-burger',
  host: {
    class: 'app-burger',
    '[class.app-burger--active]': 'active()',
    '(click)': 'onClick()',
  },
  standalone: true,
  templateUrl: './burger.component.html',
  styleUrl: './burger.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BurgerComponent {
  active = model(false);

  onClick() {
    this.active.update((active) => !active);
  }
}
