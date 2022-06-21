import { Injectable } from "@angular/core";
import { AngularFireAuthGuard } from "@angular/fire/compat/auth-guard";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({
    providedIn: 'root',
  })
export class TokenGuard implements CanActivate {
    constructor(public activateRoute:ActivatedRoute, public authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
         const queryParams = this.activateRoute.snapshot.queryParamMap;
        if(queryParams.get('senderEmail') !== 'null')
        {
            this.authService.anonymousLogin();
           console.log("heyyy " + this.authService.isAnonymous())
            return true
        }
        else if(this.authService.isLogged() === true)
        return true
        else
        return false
    }
}