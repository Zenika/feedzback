import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { IconDirective } from '../shared/icon';
import { LogoBrandTextComponent } from '../shared/logo-brand-text';
import { ANALYTICS_USAGE_URL } from '../stats/stats.constants';

@Component({
  selector: 'app-home',
  host: { class: 'app-home gbl-landing' },
  imports: [RouterLink, MatButtonModule, MatIconModule, IconDirective, LogoBrandTextComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  protected analyticsUsageUrl = ANALYTICS_USAGE_URL;
}
