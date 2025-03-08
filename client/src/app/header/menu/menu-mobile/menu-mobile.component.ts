import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/avatar';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu-mobile',
  host: { class: 'app-menu-mobile' },
  imports: [RouterLink, MatButtonModule, MatIconModule, MatListModule, MatMenuModule, AvatarComponent],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuMobileComponent {
  protected menuService = inject(MenuService);

  protected router = inject(Router);
}
