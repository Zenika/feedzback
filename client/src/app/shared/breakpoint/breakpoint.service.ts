import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';
import { BREAKPOINT_DEFAULT_CONFIG } from './breakpoint.constants';
import { BREAKPOINT_CONFIG } from './breakpoint.provider';
import { Breakpoint } from './breakpoint.types';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private config = inject(BREAKPOINT_CONFIG, { optional: true }) ?? BREAKPOINT_DEFAULT_CONFIG;

  private matchTablet = `(min-width: ${this.config.tablet}px)`;

  private matchDesktop = `(min-width: ${this.config.desktop}px)`;

  device$ = inject(BreakpointObserver)
    .observe([this.matchTablet, this.matchDesktop])
    .pipe(
      takeUntilDestroyed(),
      map(({ breakpoints }): Breakpoint => {
        const matchTablet = breakpoints[this.matchTablet];
        const matchDesktop = breakpoints[this.matchDesktop];

        return !matchTablet ? 'mobile' : !matchDesktop ? 'tablet' : 'desktop';
      }),
      shareReplay(1),
    );
}
