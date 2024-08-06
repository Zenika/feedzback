import { Component, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { delay, filter } from 'rxjs';
import { GiveRequestedFeedbackListService } from '../give-feedback/give-requested-feedback-list/give-requested-feedback-list.service';
import { AuthService } from '../shared/auth';
import { AvatarComponent } from '../shared/avatar';
import { BreakpointService } from '../shared/breakpoint';
import { EmployeeService } from '../shared/employee';
import { LanguageService } from '../shared/i18n/language';
import { ThemeService } from '../shared/theme';
import { BurgerComponent } from './burger/burger.component';
import { headerAnimations } from './header.animations';

@Component({
  selector: 'app-header',
  host: {
    class: 'app-header',
    '(document:click)': 'onDocumentClick($event.target)',
  },
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterLinkWithHref,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AvatarComponent,
    BurgerComponent,
  ],
  animations: [headerAnimations],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  private router = inject(Router);

  private authService = inject(AuthService);

  protected languageService = inject(LanguageService);

  protected themeService = inject(ThemeService);

  protected userStatus = this.authService.userStatus;

  protected userInfo = this.authService.userInfo;

  protected isManager = inject(EmployeeService).isManager;

  protected receivedRequestLength = inject(GiveRequestedFeedbackListService).listLength;

  protected device = toSignal(inject(BreakpointService).device$);

  protected isMenuOpen = false;

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
        delay(250),
      )
      .subscribe(() => (this.isMenuOpen = false));
  }

  onDocumentClick(target: HTMLElement) {
    if (!target.closest('.app-header-menu-target')) {
      this.isMenuOpen = false;
    }
  }

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
