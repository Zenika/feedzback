import { booleanAttribute, Component, input, model, signal, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TimelineDirection, TimelineModule } from '../../timeline';

@Component({
  selector: 'app-positive-feedback-guide',
  imports: [MatSlideToggleModule, TimelineModule],
  templateUrl: './positive-feedback-guide.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PositiveFeedbackGuideComponent {
  vertical = input(false, { transform: booleanAttribute });

  hideSlideToggle = input(false, { transform: booleanAttribute });

  showExample = model(false);

  protected toggleExample() {
    this.showExample.update((show) => !show);
  }

  protected direction = signal<TimelineDirection | undefined>(undefined);
}
