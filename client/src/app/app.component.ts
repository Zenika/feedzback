import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FeedZback';
  @ViewChild('menu',{static: false}) menu!: ElementRef

  constructor(public authService: AuthService, private router: Router) {
  }
  signOut() {
    this.authService.signOut();
  }
  isLogged() {
    return this.authService.isLogged();
  }
  ask() {
    this.router.navigate(['/ask'])
  }
  checkFocus(event:any) {
    if(event.target.checked)
       this.menu.nativeElement.focus()
  }
  getFirstName() {
    console.log(this.authService.getFirstName())
   return this.authService.getFirstName()
  }
}
