import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SentimentComponent } from '../review/sentiment/sentiment.component';
import { SentimentNote } from '../review/sentiment/sentiment.types';
import { requiredSentimentValidator } from '../review/sentiment/sentiment.validator';
import { NotificationService } from '../shared/notification/notification.service';
import { AvatarComponent } from '../shared/ui/avatar/avatar.component';
import { DialogTooltipDirective } from '../shared/ui/dialog-tooltip/dialog-tooltip.directive';
import { MessageComponent } from '../shared/ui/message/message.component';

@Component({
  selector: 'app-demo-content',
  standalone: true,
  imports: [
    MessageComponent,
    AvatarComponent,
    SentimentComponent,
    ReactiveFormsModule,
    MatIconModule,
    DialogTooltipDirective,
  ],
  templateUrl: './demo-content.component.html',
})
export default class DemoContentComponent {
  loremIpsum = 'Lorem ipsum';

  sentimentNote: SentimentNote = 0;

  sentimentNoteCtrl = new FormControl<SentimentNote>(0, {
    nonNullable: true,
    validators: [requiredSentimentValidator],
  });

  submitNote() {
    console.log(this.sentimentNoteCtrl.value);
  }

  protected notificationService = inject(NotificationService);
}
