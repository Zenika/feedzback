import { Component, ViewEncapsulation } from '@angular/core';
import { IconModule } from '../../shared/icon';

@Component({
  selector: 'app-content-demo',
  standalone: true,
  imports: [IconModule],
  templateUrl: './content-demo.component.html',
  styleUrl: './content-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ContentDemoComponent {
  loremIpsum = 'Lorem ipsum';
}
