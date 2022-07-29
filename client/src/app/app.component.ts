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
  @ViewChild('checkBox', {static: false}) checkBox!: ElementRef

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
    else 
      this.menu.nativeElement.blur() 
  }
  setFalseCheckbox() {
    setTimeout(()=> {
      this.checkBox.nativeElement.checked = false
    },50)
  }
  getFirstName() {
   return this.authService.getFirstName()
  }
}
