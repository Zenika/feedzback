import { Component, DOCUMENT, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../notification';

@Component({
  selector: 'app-copy-to-clipboard',
  host: { class: 'app-copy-to-clipboard' },
  imports: [MatIconModule],
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CopyToClipboardComponent {
  private document = inject(DOCUMENT);

  private notificationService = inject(NotificationService);

  value = input.required<string | number>();

  notification = input($localize`:@@Component.CopyToClipboard.Done:Copié dans le presse-papier !`);

  copied = output<void>();

  protected done = signal(false);

  protected toClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.value() + '');
    this.done.set(true);
    this.notificationService.show(this.notification(), 'success');
    this.copied.emit();
  }
}
