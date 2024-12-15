import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { AvatarComponent } from '../../shared/avatar';
import { LanguageService } from '../../shared/i18n/language';
import { ThemeService } from '../../shared/theme';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, AvatarComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  private authService = inject(AuthService);

  protected userStatus = this.authService.userStatus;

  protected userInfo = this.authService.userInfo;

  protected languageService = inject(LanguageService);

  protected themeService = inject(ThemeService);

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
