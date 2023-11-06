import { AsyncPipe, NgIf } from '@angular/common';
import { Component, HostBinding, HostListener, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { delay, filter } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { BurgerComponent } from './burger/burger.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLinkActive, RouterLinkWithHref, MatButtonModule, MatIconModule, BurgerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy {
  @HostBinding('class.app-header') hasCss = true;

  private authService = inject(AuthService);

  private router = inject(Router);

  protected firstName$ = this.authService.firstName$;

  protected isKnownUser$ = this.authService.isKnownUser$;

  protected isSignedIn$ = this.authService.isSignedIn$;

  protected isMenuOpen = false;

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

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
