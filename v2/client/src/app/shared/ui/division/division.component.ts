import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DivisionComponent {
  @HostBinding('class.app-division') hasCss = true;

  @Input({ required: true }) a!: string | number;

  @Input({ required: true }) b!: string | number;
}
