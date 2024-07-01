import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/logo';
import { ANALYTICS_USAGE_URL } from './home.constants';

@Component({
  selector: 'app-home',
  host: { class: 'app-home gbl-landing' },
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, LogoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  protected analyticsUsageUrl = ANALYTICS_USAGE_URL;
}
