import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../environments/environment';
import { VersionService } from './version.service';

@Component({
  selector: 'app-version',
  host: { class: 'app-version' },
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VersionComponent {
  private versionService = inject(VersionService);

  protected readonly clientAppVersion = this.versionService.clientAppVersion;

  protected versionsMismatch = this.versionService.versionsMismatch;

  protected tooltip = computed(() =>
    this.versionsMismatch() ? `🚨 Server version: ${this.versionService.serverAppVersion}` : '',
  );

  protected envAlias = environment.alias;

  private document = inject(DOCUMENT);

  toClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.clientAppVersion);
  }
}
