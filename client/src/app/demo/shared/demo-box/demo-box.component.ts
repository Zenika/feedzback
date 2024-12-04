import { Component, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'app-demo-box',
  host: { class: 'app-demo-box' },
  templateUrl: './demo-box.component.html',
  styleUrl: './demo-box.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DemoBoxComponent {
  heading = input<string>();
}
