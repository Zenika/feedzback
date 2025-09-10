import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BrandNameComponent } from '../shared/brand-name';
import { IconDirective } from '../shared/icon';
import { ANALYTICS_USAGE_URL } from '../stats/stats.constants';

@Component({
  selector: 'app-home',
  host: { class: 'app-home' },
  imports: [RouterLink, MatButtonModule, MatIconModule, IconDirective, BrandNameComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  protected analyticsUsageUrl = ANALYTICS_USAGE_URL;
}
