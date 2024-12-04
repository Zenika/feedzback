import { Component, ViewEncapsulation } from '@angular/core';
import { FocusComponent, FocusMainTargetDirective } from '../shared/focus';
import { LoadingComponent } from '../shared/loading';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  imports: [FocusComponent, FocusMainTargetDirective, LoadingComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
