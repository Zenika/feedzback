import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterAuthGuard implements CanActivate {
  constructor(public activateRoute:ActivatedRoute, public authService: AuthService,public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

       const urlResult = state.url.split(';');
       if(route.queryParamMap.get('senderEmail') !== null)
       {
        console.log('detaaa')
         this.authService.anonymousLogin();
         return true
       }
       else if(state.url !== '/send' && urlResult[0] !== '/result' && this.authService.isAnonymous())
        {
            this.authService.signOut();
            return false
          }
          else return this.authService.firebaseAuth.authState.pipe(
            switchMap(async (authState) => {
                if (!authState) { 
                  this.router.navigate(['sign-in'])
                    return false
                }  
                return true
            }),
        )   
  }
}


