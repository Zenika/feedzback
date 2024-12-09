import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackGuideModule } from '../shared/guide';
import { MessageComponent } from '../shared/message';

@Component({
  selector: 'app-guide',
  host: { class: 'app-guide' },
  imports: [MatIconModule, FeedbackGuideModule, MessageComponent],
  templateUrl: './guide.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GuideComponent {}
