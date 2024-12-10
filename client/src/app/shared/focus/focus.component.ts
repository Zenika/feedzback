import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FocusTopDirective } from './focus-top-target.directive';
import { FocusService } from './focus.service';

@Component({
  selector: 'app-focus',
  imports: [MatIconModule, FocusTopDirective],
  templateUrl: './focus.component.html',
  styleUrl: './focus.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FocusComponent {
  private focusService = inject(FocusService);

  protected routeTitle = this.focusService.routeTitle;

  protected focusMain() {
    this.focusService.focusMain();
  }
}
