import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {tap} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.hasSenderEmail(route)) {
      return this.authService.signInAnonymously().then(() => true);
    }

    if (this.isNotSendOrResult(state)) {
      return this.authService.signOut().then(() => false);
    }

    return this.authService.isLogged$.pipe(
        tap((isLogged) => {
          if (isLogged) {
            return;
          }
          this.authService.redirectUrlAfterSignIn = state.url;
          this.router.navigate(['sign-in']);
        }),
    );
  }

  private hasSenderEmail(route: ActivatedRouteSnapshot) {
    return route.queryParamMap.get('senderEmail') !== null;
  }

  // !FIXME: use case not clear
  private isNotSendOrResult(state: RouterStateSnapshot) {
    const urlResult = state.url.split(';')[0]; // !FIXME: not clear why slit ";"
    return this.authService.isAnonymousSnapshot() && urlResult !== '/send' && urlResult !== '/result';
  }
}
