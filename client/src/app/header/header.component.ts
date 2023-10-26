import {Component, HostListener, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {delay, filter} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy {
  firstName$ = this.authService.firstName$;

  isLogged$ = this.authService.isLogged$;

  isMenuOpen = false;

  @HostListener('document:click', ['$event.target']) onClick(target: HTMLElement) {
    if (!target.closest('.app-header-menu-target')) {
      this.isMenuOpen = false;
    }
  }

  private subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), delay(350))
      .subscribe(() => (this.isMenuOpen = false));

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  signOut() {
    this.authService.signOut().subscribe();
  }
}
