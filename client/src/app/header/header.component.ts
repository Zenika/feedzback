import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, HostListener, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { delay, filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth';
import { EmployeeService } from '../shared/employee/employee.service';
import { LanguageService } from '../shared/i18n/language';
import { AvatarComponent } from '../shared/ui/avatar/avatar.component';
import { BurgerComponent } from './burger/burger.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterLinkWithHref,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AvatarComponent,
    BurgerComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy {
  @HostBinding('class.app-header') hasCss = true;

  private authService = inject(AuthService);

  private router = inject(Router);

  protected languageService = inject(LanguageService);

  protected isManager = toSignal(inject(EmployeeService).isManager$, { initialValue: false });

  protected userInfo$ = this.authService.userInfo$;

  protected isKnownUser$ = this.authService.isKnownUser$;

  protected isSignedIn$ = this.authService.isSignedIn$;

  protected isMenuOpen = false;

  protected hasLocalizeFeature = environment.featureFlipping.localize;

  protected hasManagerFeature = environment.featureFlipping.manager;

  @HostListener('document:click', ['$event.target']) onClick(target: HTMLElement) {
    if (!target.closest('.app-header-menu-target')) {
      this.isMenuOpen = false;
    }
  }

  private subscription = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      delay(250),
    )
    .subscribe(() => (this.isMenuOpen = false));

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
