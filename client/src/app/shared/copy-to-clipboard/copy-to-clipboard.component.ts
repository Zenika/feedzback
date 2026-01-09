import { Component, DOCUMENT, ElementRef, inject, input, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../notification';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[appCopyToClipboard]',
  host: {
    class: 'app-copy-to-clipboard',
    '(click)': 'toClipboard()',
  },
  imports: [MatIconModule],
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CopyToClipboardComponent {
  private document = inject(DOCUMENT);

  private notificationService = inject(NotificationService);

  // Ensure that developers define the `aria-label` attribute
  // (preventing screen readers from reading the content, which is usually unreadable)
  public ariaLabel = input.required<string>({ alias: 'aria-label' });

  notification = input($localize`:@@Component.CopyToClipboard.Done:Copié dans le presse-papier !`);

  protected content = viewChild<ElementRef<HTMLElement>>('content');

  protected done = signal(false);

  protected toClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.content()?.nativeElement.textContent.trim() ?? '');
    this.done.set(true);
    this.notificationService.show(this.notification(), 'success');
  }
}
