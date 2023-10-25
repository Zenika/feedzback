import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {map, tap} from 'rxjs';
import {AuthService, AUTH_REDIRECT_PARAM} from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.hasSenderEmail(route)) {
      return this.authService.signInAnonymously();
    }

    if (this.isNotSendOrResult(state)) {
      return this.authService.signOut().pipe(map(() => false));
    }

    return this.authService.isLogged$.pipe(
        tap((isLogged) => {
          if (isLogged) {
            return;
          }
          this.router.navigate(['sign-in'], {queryParams: {[AUTH_REDIRECT_PARAM]: state.url}});
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
