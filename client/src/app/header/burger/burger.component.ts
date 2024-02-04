import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-burger',
  host: {
    class: 'app-burger',
    '[class.app-burger--active]': 'active',
    '(click)': 'onClick()',
  },
  standalone: true,
  templateUrl: './burger.component.html',
  styleUrl: './burger.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BurgerComponent {
  @Input() active = false;

  @Output() activeChange = new EventEmitter<boolean>();

  onClick() {
    this.active = !this.active;
    this.activeChange.emit(this.active);
  }
}
