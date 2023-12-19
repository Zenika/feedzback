import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  @HostBinding('class.app-layout') hasCss = true;
}
