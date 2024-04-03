import { Component, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-layout',
  host: { class: 'app-layout' },
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {}
