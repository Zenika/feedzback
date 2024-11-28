import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '../../shared/icon';

@Component({
  selector: 'app-content-demo',
  imports: [MatIconModule, IconDirective],
  templateUrl: './content-demo.component.html',
  styleUrl: './content-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ContentDemoComponent {
  loremIpsum = 'Lorem ipsum';
}
