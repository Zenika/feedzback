import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '../shared/icon';
import { LogoComponent } from '../shared/logo';

@Component({
  selector: 'app-maintenance',
  host: { class: 'app-maintenance gbl-landing' },
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatIconModule, IconDirective, LogoComponent],
})
export class MaintenanceComponent {
  private document = inject(DOCUMENT);

  protected reload() {
    this.document.defaultView?.location.reload();
  }
}
