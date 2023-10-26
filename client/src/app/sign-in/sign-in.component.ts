import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  disabled = false;

  constructor(private authService: AuthService) {}

  signInWithGoogle() {
    this.disabled = true;
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled = false;
      }
    });
  }
}
