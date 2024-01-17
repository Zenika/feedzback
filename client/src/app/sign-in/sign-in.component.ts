import { Component, HostBinding, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  styleUrl: './sign-in.component.scss',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit {
  @HostBinding('class.app-sign-in') hasCss = true;

  @HostBinding('class.gbl-landing') hasGlobalCss = true;

  private router = inject(Router);
  private authService = inject(AuthService);

  protected disabled = false;

  signInErrorMessage = '';

  constructor(private route: ActivatedRoute) {}

  signInWithGoogle() {
    this.disabled = true;
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled = false;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async ({ custom_token, access_token, refresh_token, err }) => {
      if (custom_token && access_token && refresh_token) {
        try {
          await this.authService.loginViaProvider(custom_token, access_token, refresh_token);
        } catch (err) {
          this.signInErrorMessage = typeof err === 'string' ? err : (err as Error).message;
          this.router.navigate(['/sign-in']);
          return;
        }
        this.router.navigate(['/']);
      }

      if (err) {
        this.signInErrorMessage = err;
      }
    });
  }
}
