import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  indexActivatedItem : number = 0

  constructor(public authService: AuthService, private router: Router) {
  }
  signOut() {
    this.authService.signOut();
  }
  isLogged() {
    return this.authService.isLogged();
  }
  onClickItem(route: String, index: number) {
    this.router.navigate([route])
    this.indexActivatedItem = index
    this.hideMenu()
  }
  hideMenu() {
  this.checkBox.nativeElement.checked = false
  }
  getFirstName() {
   return this.authService.getFirstName()
  }
}
