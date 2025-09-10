import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/avatar';
import { MenuService } from '../menu.service';

// Important note:
// `MenuDesktopComponent` and `MenuMobileComponent` are 2 implementations of the same menu.
// They must therefore display the same items!

@Component({
  selector: 'app-menu-mobile',
  host: { class: 'app-menu-mobile' },
  imports: [RouterLink, MatButtonModule, MatIconModule, MatListModule, AvatarComponent],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuMobileComponent {
  protected menuService = inject(MenuService);
}
