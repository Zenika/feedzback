import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-guide',
  host: { class: 'app-guide' },
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GuideComponent {}
