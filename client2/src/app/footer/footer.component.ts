import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
  @HostBinding('class.app-footer') hasCss = true;

  protected currentYear = new Date().getFullYear();
}
