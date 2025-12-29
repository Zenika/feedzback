import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MessageComponent } from '../shared/message';
import { NotFoundNavigationState } from './not-found.types';

@Component({
  selector: 'app-not-found',
  host: { class: 'gbl-info' },
  imports: [RouterLink, MatButtonModule, MatIconModule, MessageComponent],
  templateUrl: './not-found.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent {
  protected navigationState = inject(Router).currentNavigation()?.extras.state as
    | Partial<NotFoundNavigationState>
    | undefined;
}
