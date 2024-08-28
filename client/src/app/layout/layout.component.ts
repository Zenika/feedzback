import { Component, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '../shared/loading';
import { SkipToMainContentComponent, SkipToMainContentDirective } from './skip-to-main-content';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  standalone: true,
  imports: [LoadingComponent, SkipToMainContentComponent, SkipToMainContentDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
