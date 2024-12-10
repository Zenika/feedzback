import { Component, ViewEncapsulation } from '@angular/core';
import { FocusComponent, FocusMainDirective } from '../shared/focus';
import { LoadingComponent } from '../shared/loading';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  imports: [FocusComponent, FocusMainDirective, LoadingComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
