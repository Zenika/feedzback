import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {map} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignInGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isLogged$.pipe(map((isLogged) => !isLogged));
  }
}
