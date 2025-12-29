import { Component, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval, map, startWith, take } from 'rxjs';
import { SESSION_CONFIG } from '../session.constants';

@Component({
  selector: 'app-session-warning',
  host: { class: 'app-session-warning' },
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './session-warning.component.html',
  styleUrl: './session-warning.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SessionWarningComponent {
  private readonly config = SESSION_CONFIG;

  private readonly idleInfos = {
    idleSince: (this.config.idle - this.config.idleWarning) * 1000,
    remainingTime: this.config.idleWarning * 1000,
  } as const;

  protected idleSinceInMinutes = `${Math.floor(this.idleInfos.idleSince / 60_000)} minutes`;

  private idleSteps = this.config.idleWarning - 1;

  protected idleCountDown = toSignal(
    interval(1000).pipe(
      startWith(-1),
      take(this.idleSteps + 1),
      map((i) => Math.round(((this.idleSteps - 1 - i) * 100) / this.idleSteps)),
    ),
  );
}
