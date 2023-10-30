import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/auth/auth.service';
import { LayoutModule } from './shared/layout/layout.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterOutlet, LayoutModule],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  protected isLogged$ = inject(AuthService).isLogged$;
}
