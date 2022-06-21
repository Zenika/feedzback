import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterAuthGuard implements CanActivate {
  constructor(public router: Router, public activateRoute:ActivatedRoute, public authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      const queryParams = this.activateRoute.snapshot.queryParamMap;
       if(route.queryParamMap.get('senderEmail') !== null)
       {
         this.authService.anonymousLogin();
         return true
       }
        else if(state.url !== '/send' && state.url !== '/result' && this.authService.isAnonymous())
          {
            this.authService.signOut();
            return false
          }
        if(this.authService.isLogged() === true) {
         console.log('comment')
        return true
       }
        else {
          return false
        }
  }
}
