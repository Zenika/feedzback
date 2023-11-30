import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, first, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    return !!this.authService.user;
  }
}
