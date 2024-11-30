import { Component, ViewEncapsulation } from '@angular/core';
import { FocusContentSkipLinksComponent, FocusContentTargetDirective } from '../shared/focus-content';
import { LoadingComponent } from '../shared/loading';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  imports: [FocusContentSkipLinksComponent, FocusContentTargetDirective, LoadingComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
