import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-link',
  templateUrl: './tab-link.component.html',
  styleUrls: ['./tab-link.component.css'],
})
export class TabLinkComponent {
  @Input('tabTitle') title!: string;
  @Input() active = false;
}
