import { APP_BASE_HREF, AsyncPipe } from '@angular/common';
import { Component, HostBinding, HostListener, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { delay, filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth/auth.service';
import { EmployeeService } from '../shared/employee/employee.service';
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

  protected baseHref = inject(APP_BASE_HREF) as '/' | '/fr/' | '/en/';

  protected isManager = toSignal(inject(EmployeeService).isManager$, { initialValue: false });

  protected photoUrl$ = this.authService.photoUrl$;

  protected isKnownUser$ = this.authService.isKnownUser$;

  protected isSignedIn$ = this.authService.isSignedIn$;

  protected isMenuOpen = false;

  protected hasManagerFeature = environment.featureFlipping.manager;

  protected hasLocalizeFeature = environment.featureFlipping.localize;

  @HostListener('document:click', ['$event.target']) onClick(target: HTMLElement) {
    if (!target.closest('.app-header-menu-target')) {
      this.isMenuOpen = false;
    }
  }

  private subscription = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      delay(350),
    )
    .subscribe(() => (this.isMenuOpen = false));

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected switchLanguage() {
    switch (this.baseHref) {
      case '/fr/': {
        document.cookie = 'firebase-language-override=en; path=/';
        document.cookie = 'firebase-country-override=US; path=/';
        document.location.assign('/en/');
        break;
      }
      case '/en/': {
        document.cookie = 'firebase-language-override=fr; path=/';
        document.cookie = 'firebase-country-override=FR; path=/';
        document.location.assign('/fr/');
        break;
      }
    }
  }

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
