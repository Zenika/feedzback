import { Component, DOCUMENT, ViewEncapsulation, computed, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../environments/environment';
import { VersionService } from './version.service';

@Component({
  selector: 'app-version',
  host: { class: 'app-version' },
  imports: [MatTooltipModule],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VersionComponent {
  protected versions = inject(VersionService).versions;

  protected serverVersionMismatchTooltip = computed(() =>
    this.versions().mismatch ? `🚨 Server version mismatch: ${this.versions().server}` : '',
  );

  protected envAlias = environment.alias;

  private document = inject(DOCUMENT);

  toClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.versions().client);
  }
}
