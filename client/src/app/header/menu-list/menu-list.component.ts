import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { AvatarComponent } from '../../shared/avatar';
import { LanguageService } from '../../shared/i18n/language';
import { ThemeService } from '../../shared/theme';

@Component({
  selector: 'app-menu-list',
  host: { class: 'app-menu-list' },
  imports: [RouterLink, MatButtonModule, MatIconModule, MatListModule, MatMenuModule, AvatarComponent],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuListComponent {
  protected router = inject(Router);

  private authService = inject(AuthService);

  protected userStatus = this.authService.userStatus;

  protected userInfo = this.authService.userInfo;

  protected languageService = inject(LanguageService);

  protected themeService = inject(ThemeService);

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
