import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeData } from '../shared/employee';
import { MessageComponent } from '../shared/message';

@Component({
  selector: 'app-settings',
  host: { class: 'app-settings' },
  imports: [MatIconModule, MessageComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class SettingsComponent {
  employeeData = input.required<EmployeeData>();
}
