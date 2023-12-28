import { Component } from '@angular/core';
import { MessageComponent } from '../shared/ui/message/message.component';

@Component({
  selector: 'app-demo-content',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './demo-content.component.html',
})
export class DemoContentComponent {}
