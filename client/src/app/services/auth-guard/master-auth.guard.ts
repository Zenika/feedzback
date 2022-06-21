import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterAuthGuard implements CanActivate {
  constructor(public activateRoute:ActivatedRoute, public authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
       const queryParams = this.activateRoute.snapshot.queryParamMap;

       if(this.authService.isLogged() === true)
       return true
       else if(queryParams.get('senderEmail') !== 'null')
      {
          this.authService.anonymousLogin();
          return true
      } else
        return false
  }
}
