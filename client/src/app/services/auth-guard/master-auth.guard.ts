import { Injectable } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterAuthGuard implements CanActivate {
  constructor(public activateRoute:ActivatedRoute, public authService: AuthService, public firebaseGuard: AngularFireAuthGuard) {}

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
        if(this.firebaseGuard.canActivate(route,state))
            return true
        else 
          return false     
  }
}
