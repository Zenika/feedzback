import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/ui/logo/logo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, LogoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  @HostBinding('class.app-home') hasCss = true;

  @HostBinding('class.gbl-landing') hasGlobalCss = true;
}
