import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FocusContentService } from './focus-content.service';

@Component({
  selector: 'app-focus-content-skip-links',
  imports: [MatIconModule],
  templateUrl: './focus-content-skip-links.component.html',
  styleUrl: './focus-content-skip-links.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FocusContentSkipLinksComponent {
  private focusContentService = inject(FocusContentService);

  protected focusTarget() {
    this.focusContentService.focusTarget();
  }
}
