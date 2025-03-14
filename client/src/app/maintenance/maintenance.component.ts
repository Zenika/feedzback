import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '../shared/icon';
import { LogoBrandTextComponent } from '../shared/logo-brand-text';

// TODO: update to match the new `.gbl-landing`...

@Component({
  selector: 'app-maintenance',
  host: { class: 'app-maintenance gbl-landing' },
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatIconModule, IconDirective, LogoBrandTextComponent],
})
export class MaintenanceComponent {
  private document = inject(DOCUMENT);

  protected reload() {
    this.document.defaultView?.location.reload();
  }
}
