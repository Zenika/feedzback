import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-burger',
  templateUrl: './burger.component.html',
  styleUrls: ['./burger.component.css'],
})
export class BurgerComponent {
  @Input() @HostBinding('class.burger--active') active = false;

  @Output() activeChange = new EventEmitter<boolean>();

  @HostListener('click') onClick() {
    this.active = !this.active;
    this.activeChange.emit(this.active);
  }
}
