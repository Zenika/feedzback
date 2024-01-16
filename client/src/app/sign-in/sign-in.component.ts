import { Component, HostBinding, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit {
  @HostBinding('class.app-sign-in') hasCss = true;

  @HostBinding('class.gbl-landing') hasGlobalCss = true;

  private router = inject(Router);
  private authService = inject(AuthService);

  protected disabled = false;

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
    this.route.queryParams.subscribe(async ({ custom_token, access_token }) => {
      if (custom_token && access_token) {
        await this.authService.loginViaProvider(custom_token, access_token);
        this.router.navigate(['/']);
      }
    });
  }
}
