import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GuideComponent {
  @HostBinding('class.app-guide') hasCss = true;
}
