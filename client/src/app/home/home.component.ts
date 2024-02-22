import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/ui/logo';

@Component({
  selector: 'app-home',
  host: { class: 'app-home gbl-landing' },
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, LogoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {}
