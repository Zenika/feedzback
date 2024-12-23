import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FocusContentTopDirective } from './focus-content-top.directive';
import { FocusContentService } from './focus-content.service';

@Component({
  selector: 'app-focus-content',
  imports: [MatIconModule, FocusContentTopDirective],
  templateUrl: './focus-content.component.html',
  styleUrl: './focus-content.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FocusContentComponent {
  private focusContentService = inject(FocusContentService);

  protected routeTitle = this.focusContentService.routeTitle;

  protected focusMain() {
    this.focusContentService.focusMain();
  }
}
