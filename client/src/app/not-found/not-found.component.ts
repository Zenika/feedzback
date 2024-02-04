import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  host: { class: 'gbl-info' },
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './not-found.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent {}
