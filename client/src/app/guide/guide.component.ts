import { Component, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FeedbackGuideModule } from '../shared/guide';
import { MessageComponent } from '../shared/message';

@Component({
  selector: 'app-guide',
  host: { class: 'app-guide' },
  imports: [MatIconModule, MatSlideToggleModule, MatTabsModule, FeedbackGuideModule, MessageComponent],
  templateUrl: './guide.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GuideComponent {
  protected showExample = signal(false);

  protected toggleExample() {
    this.showExample.update((show) => !show);
  }
}
