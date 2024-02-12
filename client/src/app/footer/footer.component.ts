import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-footer',
  host: { class: 'app-footer' },
  standalone: true,
  imports: [MatIconModule, ReviewComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
  protected currentYear = new Date().getFullYear();
}
