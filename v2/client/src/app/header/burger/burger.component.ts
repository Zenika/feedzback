import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-burger',
  standalone: true,
  templateUrl: './burger.component.html',
  styleUrls: ['./burger.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BurgerComponent {
  @HostBinding('class.app-burger') hasCss = true;

  @Input() @HostBinding('class.app-burger--active') active = false;

  @Output() activeChange = new EventEmitter<boolean>();

  @HostListener('click') onClick() {
    this.active = !this.active;
    this.activeChange.emit(this.active);
  }
}
