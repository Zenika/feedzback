import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { LanguageService } from '../../shared/i18n/language';
import { ThemeService } from '../../shared/theme';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private authService = inject(AuthService);

  userStatus = this.authService.userStatus;

  userInfo = this.authService.userInfo;

  languageService = inject(LanguageService);

  themeService = inject(ThemeService);

  signOut() {
    this.authService.signOut().subscribe();
  }
}
