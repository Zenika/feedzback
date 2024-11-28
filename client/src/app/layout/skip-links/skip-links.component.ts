import { Component, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkipLinksTargetDirective } from './skip-links-target.directive';

@Component({
  selector: 'app-skip-links',
  imports: [MatIconModule],
  templateUrl: './skip-links.component.html',
  styleUrls: ['./skip-links.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkipLinksComponent {
  target = input<SkipLinksTargetDirective>();

  protected focusTarget() {
    this.target()?.focus();
  }
}
