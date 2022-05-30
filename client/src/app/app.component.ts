import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FeedZback';
  constructor(public authService: AuthService) {}
  signOut() {
    this.authService.signOut();
  }
  isLogged() {
    return this.authService.isLogged();
  }
}
