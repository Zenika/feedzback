import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { delay, filter } from 'rxjs';
import { AuthService } from '../shared/auth';
import { IconDirective } from '../shared/icon';
import { BurgerComponent } from './burger/burger.component';
import { MenuDesktopComponent, MenuMobileComponent } from './menu';
import { PrimaryNavComponent } from './primary-nav/primary-nav.component';

@Component({
  selector: 'app-header',
  host: { class: 'app-header' },
  imports: [
    MatIconModule,
    RouterLinkActive,
    RouterLinkWithHref,
    IconDirective,
    BurgerComponent,
    MenuDesktopComponent,
    MenuMobileComponent,
    PrimaryNavComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  private router = inject(Router);

  protected userStatus = inject(AuthService).userStatus;

  protected isNavOpen = signal(false);

  protected isNavVisible = signal(false);

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
        delay(250),
      )
      .subscribe(() => this.closeNav());
  }

  protected closeNav() {
    this.isNavOpen.set(false);
  }

  protected onNavTransition(type: 'start' | 'end') {
    if (type === 'start' && this.isNavOpen()) {
      this.isNavVisible.set(true);
    } else if (type === 'end' && !this.isNavOpen()) {
      this.isNavVisible.set(false);
    }
  }
}
