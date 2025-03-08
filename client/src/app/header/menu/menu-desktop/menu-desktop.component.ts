import { Component, inject, viewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { filter, skip } from 'rxjs';
import { AvatarComponent } from '../../../shared/avatar';
import { BreakpointService } from '../../../shared/breakpoint';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu-desktop',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, AvatarComponent],
  templateUrl: './menu-desktop.component.html',
  styleUrl: './menu-desktop.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuDesktopComponent {
  protected menuService = inject(MenuService);

  private matMenuTrigger = viewChild.required(MatMenuTrigger);

  constructor() {
    inject(BreakpointService)
      .device$.pipe(
        takeUntilDestroyed(),
        skip(1),
        filter((device) => device === 'mobile'),
      )
      .subscribe(() => this.matMenuTrigger().closeMenu());
  }
}
