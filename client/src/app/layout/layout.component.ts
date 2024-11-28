import { Component, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '../shared/loading';
import { SkipLinksComponent, SkipLinksTargetDirective } from './skip-links';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  imports: [LoadingComponent, SkipLinksComponent, SkipLinksTargetDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
