import { booleanAttribute, Component, input, signal, ViewEncapsulation } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TimelineDirection, TimelineModule } from '../../timeline';

@Component({
  selector: 'app-positive-feedback-guide',
  imports: [MatSlideToggleModule, MatCheckboxModule, TimelineModule],
  templateUrl: './positive-feedback-guide.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PositiveFeedbackGuideComponent {
  vertical = input(false, { transform: booleanAttribute });

  protected showExample = signal(false);

  protected toggleExample() {
    this.showExample.update((show) => !show);
  }

  protected direction = signal<TimelineDirection | undefined>(undefined);
}
