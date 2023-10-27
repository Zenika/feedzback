import { AsyncPipe, NgIf } from '@angular/common';
import { Component, HostBinding, HostListener, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { delay, filter } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { BurgerComponent } from './burger/burger.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLinkActive, RouterLinkWithHref, BurgerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy {
  firstName$ = this.authService.firstName$;

  isLogged$ = this.authService.isLogged$;

  isMenuOpen = false;

  @HostBinding('class.app-header') hasCss = true;

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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  signOut() {
    this.authService.signOut().subscribe();
  }
}
