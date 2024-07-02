import { TitleCasePipe } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatChipsModule } from '@angular/material/chips';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TitleCasePipe, MatChipsModule],
  templateUrl: './demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DemoComponent {
  private router = inject(Router);

  protected paths = ['avatar', 'color', 'content', 'dialog-tooltip', 'icon', 'message', 'notification'];

  protected currentPath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(({ url }) => url.replace(/^\/demo\/?/, '')),
    ),
  );

  pathSelected(selected: boolean) {
    if (!selected) {
      this.router.navigateByUrl('/demo');
    }
  }
}
