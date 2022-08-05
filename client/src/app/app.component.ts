import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { event } from 'cypress/types/jquery';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FeedZback';
  @ViewChild('menuToggle',{static: false}) menu!: ElementRef
  @ViewChild('checkBox', {static: false}) checkBox!: ElementRef
  
  constructor(public authService: AuthService, public router: Router, public active: ActivatedRoute) {
  }
  signOut() {
    this.authService.signOut();
  }
  isLogged() {
    return this.authService.isLogged();
  }
  onClickItem(route: String) {
    this.router.navigate([route]).then(()=> {
      this.hideMenu()
    })
  }
  hideMenu() {
  this.checkBox.nativeElement.checked = false
  }
  getFirstName() {
   return this.authService.getFirstName()
  }
}
