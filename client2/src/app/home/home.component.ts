import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  @HostBinding('class.gbl-landing') hasGlobalCss = true;
}
